from flask import request, Response
import json
from datetime import datetime
from db_connection import DatabaseConnection
import logging
from token_utility import TokenUtility

logging.basicConfig(level=logging.INFO)

class ScheduleAPIHandler:
    def __init__(self, app):
        self.app = app
        self.register_routes()

    def register_routes(self):
        # 1. Create Record
        @self.app.route('/schedule/create', methods=['POST'])
        def create_schedule():
            try:
                # 입력 데이터 수신
                data = request.json

                access_token = request.headers.get('Authorization')
                session_date_str = data.get('sessionDate')  # 문자열로 수신
                reservationInfo = data.get('reservationInfo')
                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                # 필수 데이터 검증
                if not all([user_id, user_type, session_date_str, reservationInfo]):
                    return Response(json.dumps({'message': 'Missing required fields'}), status=400, mimetype='application/json')
                logging.error("[schedule_create] get")


                # session_date
                try:
                    session_date = datetime.strptime(session_date_str, '%Y-%m-%d')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd.'}),
                        status=400,
                        mimetype='application/json'
                    )
                trainer_id = reservationInfo["trainerId"]
                # start, end 문자열을 TIMESTAMP 형식으로 변환
                try:
                    start_time = datetime.strptime(reservationInfo["startTime"], '%H:%M:%S')
                    end_time = datetime.strptime(reservationInfo["endTime"], '%H:%M:%S')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use HH:MM:SS.'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # user_id로 customerId 가지고 오기
                auth_query = """
                    SELECT id
                    FROM credential.user_auth
                    WHERE user_id = %s AND usertype = %s
                """
                cursor.execute(auth_query, (user_id, 'customer'))
                result = cursor.fetchone()

                if not result:
                    logging.error("No matching customer found for the given user_id")
                    return Response(
                        json.dumps({'message': 'No matching customer found'}),
                        status=404,
                        mimetype='application/json'
                    )

                customer_id = result[0]  # customer_id 추출

                # Step 2: raw_data.pt_schedule에 레코드 삽입
                '''
                access_token
                sessionDate
                reservationInfo {
                    trainerId : int;
                    startTime : string;
                    endTime : string;
                } (customerId, usertype 가져올것 백엔드, 무조건 status는 예약)
                '''

                insert_query = """
                    INSERT INTO raw_data.pt_schedule (customer_id, trainer_id, start_time, end_time, session_date, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING schedule_id
                """
                cursor.execute(insert_query, (customer_id, trainer_id, start_time.time(), end_time.time(), session_date.date(), "예약"))
                schedule_id = cursor.fetchone()[0]



                connection.commit()
                # 성공 응답 반환
                return Response(
                    json.dumps({'message': 'Schedule created', 'scheduleId': schedule_id, 'sessionDate': session_date_str}),
                    status=201,
                    mimetype='application/json'
                )

            except Exception as e:
                return Response(json.dumps({'message': f'An error occurred: {e}'}), status=500, mimetype='application/json')

        # 2. Read Record
        @self.app.route('/schedule/read', methods=['GET'])
        def read_schedule():
            try:
                # 입력값 처리
                access_token = request.headers.get('Authorization')
                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                session_date_str = request.args.get('sessionDate')

                # 필수 입력값 확인
                if not all([user_id, user_type, session_date_str]):
                    return Response(
                        json.dumps({'message': 'Missing required fields'}),
                        status=400,
                        mimetype='application/json'
                    )

                # session_date
                try:
                    session_date = datetime.strptime(session_date_str, '%Y-%m-%d')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd.'}),
                        status=400,
                        mimetype='application/json'
                    )
                logging.error("[schedule_read] get")

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # user_auth에서 id 조회
                auth_query = """
                    SELECT id
                    FROM credential.user_auth
                    WHERE user_id = %s AND usertype = %s
                """
                cursor.execute(auth_query, (user_id, user_type))
                result = cursor.fetchone()

                if not result:
                    logging.error(f"No matching {user_type} found for the given user_id")
                    return Response(
                        json.dumps({'message': f'No matching {user_type} found'}),
                        status=404,
                        mimetype='application/json'
                    )

                auth_id = result[0]  # id 값 추출

                # usertype에 따라 schedule 조회
                if user_type == 'customer':
                    schedule_query = """
                        SELECT schedule_id, trainer_id, customer_id, start_time, end_time, status
                        FROM raw_data.pt_schedule
                        WHERE customer_id = %s and session_date = %s
                    """
                elif user_type == 'trainer':
                    schedule_query = """
                        SELECT schedule_id, trainer_id, customer_id, start_time, end_time, status
                        FROM raw_data.pt_schedule
                        WHERE trainer_id = %s and session_date = %s
                    """
                else:
                    logging.error("Invalid usertype provided")
                    return Response(
                        json.dumps({'message': 'Invalid usertype provided'}),
                        status=400,
                        mimetype='application/json'
                    )

                cursor.execute(schedule_query, (auth_id, session_date))
                schedules = cursor.fetchall()

                # 결과를 리스트로 변환
                schedule_list = []
                for schedule in schedules:
                    # customer 이름 가져오기
                    cursor.execute("""
                        SELECT name
                        FROM raw_data.customer
                        WHERE customer_id = %s
                    """, (schedule[2],))
                    result = cursor.fetchone()
                    if result:
                        customer_name = result[0]  # 첫 번째 값만 가져옴
                    else:
                        customer_name = None

                    # 트레이너 이름 가져오기
                    cursor.execute("""
                        SELECT name
                        FROM raw_data.trainer
                        WHERE trainer_id = %s
                    """, (schedule[1],))
                    result = cursor.fetchone()
                    if result:
                        trainer_name = result[0]  # 첫 번째 값만 가져옴
                    else:
                        trainer_name = None

                    schedule_list.append({
                        "scheduleId": schedule[0],
                        "trainerId": schedule[1],
                        "customerId": schedule[2],
                        "trainerName": trainer_name,
                        "customerName": customer_name,
                        "startTime": str(schedule[3]),  # TIME 형식 변환
                        "endTime": str(schedule[4]),    # TIME 형식 변환
                        "status": schedule[5]
                    })
                    logging.error(f"[schedule_read] schedule_list: {schedule_list}")

                # 결과 반환
                return Response(
                    json.dumps({'message': 'Read successful', 'userType': user_type, 'schedules': schedule_list}),
                    status=200,
                    mimetype='application/json'
                )

            except Exception as e:
                return Response(
                    json.dumps({'message': f'An error occurred: {e}'}),
                    status=500,
                    mimetype='application/json'
                )


        # 3. Update Record
        @self.app.route('/schedule/update', methods=['PUT'])
        def update_schedule():
            try:
                # 입력값 처리
                data = request.json

                access_token = request.headers.get('Authorization')
                session_date_str = data.get('sessionDate')
                schedule_id = data.get('scheduleId')
                schedules = data.get('schedules')

                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                # 필수 입력값 확인
                if not all([user_id, user_type, session_date_str, schedule_id, schedules]):
                    return Response(json.dumps({'message': 'Missing required fields'}), status=400, mimetype='application/json')
                logging.error("[schedule_update] put")

                # sessionDate를 datetime 객체로 변환
                try:
                    session_date = datetime.strptime(session_date_str, '%Y-%m-%d')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd HH:MM:SS.'}),
                        status=400,
                        mimetype='application/json'
                    )
                # 변수로 json 변환
                trainer_id = schedules["trainerId"]
                customer_id = schedules["customerId"]
                start_time = schedules["startTime"]
                end_time = schedules["endTime"]
                status = schedules["status"]
                # start, end 문자열을 TIMESTAMP 형식으로 변환
                try:
                    start_time = datetime.strptime(start_time, '%H:%M:%S')
                    end_time = datetime.strptime(end_time, '%H:%M:%S')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use HH:MM:SS.'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # pt_schedule 업데이트
                # Step 1: user_id로 customer_id / trainer_id 조회
                auth_query = """
                    SELECT id
                    FROM credential.user_auth
                    WHERE user_id = %s AND usertype = %s
                """
                cursor.execute(auth_query, (user_id, user_type))
                result = cursor.fetchone()

                if not result:
                    logging.error("No matching customer found for the given user_id")
                    return Response(
                        json.dumps({'message': 'No matching customer found'}),
                        status=404,
                        mimetype='application/json'
                    )

                id = result[0]  # customer_id / trainer_id 추출

                # Step 2: raw_data.pt_schedule 업데이트
                '''
                schedules {
                    trainerId : int;
                    customerId : int;
                    startTime : string;
                    endTime : string;
                    status : string; // 상태 (예: 예약, 완료)
                }
                '''
                if user_type == "customer":
                    cursor.execute("""
                    UPDATE raw_data.pt_schedule
                    SET session_date = %s, trainer_id = %s, start_time = %s, end_time = %s, status = %s
                    WHERE schedule_id = %s AND customer_id = %s
                    """, (session_date, trainer_id, start_time.time(), end_time.time(), status, schedule_id, id))
                elif user_type == "trainer":
                    cursor.execute("""
                    UPDATE raw_data.pt_schedule
                    SET session_date = %s, customer_id = %s, start_time = %s, end_time = %s, status = %s
                    WHERE schedule_id = %s AND trainer_id = %s
                    """, (session_date, customer_id, start_time.time(), end_time.time(), status, schedule_id, id))
                else:
                    logging.error("Invalid usertype provided")
                    return Response(
                        json.dumps({'message': 'Invalid usertype provided'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection.commit()

                # 성공 응답
                return Response(
                    json.dumps({'message': 'Schedule updated successfully'}),
                    status=200,
                    mimetype='application/json'
                )

            except Exception as e:
                # 에러 응답
                return Response(
                    json.dumps({'message': f'An error occurred: {e}'}),
                    status=500,
                    mimetype='application/json'
                )

        # 4. Delete Record
        @self.app.route('/schedule/delete', methods=['DELETE'])
        def delete_schedule():
            try:
                data = request.json

                access_token = request.headers.get('Authorization')

                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                schedule_id = data.get('scheduleId')

                if not all([user_id, user_type, schedule_id]):
                    return Response(
                        json.dumps({'message': 'Missing required fields'}),
                        status=400,
                        mimetype='application/json'
                    )
                logging.error("[schedule_delete] get")
                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # pt_schedule에서 레코드 삭제
                cursor.execute("DELETE FROM raw_data.pt_schedule WHERE schedule_id = %s", (schedule_id,))
                connection.commit()
                return Response(
                    json.dumps({'message': 'Schedule deleted successfully'}),
                    status=200,
                    mimetype='application/json'
                )

            except Exception as e:
                return Response(
                    json.dumps({'message': f'An error occurred: {e}'}),
                    status=500,
                    mimetype='application/json'
                )

        # 5. Monthly Record
        @self.app.route('/schedule/monthly_schedule', methods=['GET'])
        def read_monthly_schedule():
            try:
                # 입력값 처리
                access_token = request.headers.get('Authorization')
                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                session_year = request.args.get('year')
                session_month = request.args.get('month')

                # 필수 입력값 확인
                if not all([user_id, user_type, session_year, session_month]):
                    return Response(
                        json.dumps({'message': 'Missing required fields'}),
                        status=400,
                        mimetype='application/json'
                    )
                logging.error("[schedule_monthly_read] get")

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # user_auth에서 id 조회
                auth_query = """
                    SELECT id
                    FROM credential.user_auth
                    WHERE user_id = %s AND usertype = %s
                """
                cursor.execute(auth_query, (user_id, user_type))
                result = cursor.fetchone()

                if not result:
                    logging.error(f"No matching {user_type} found for the given user_id")
                    return Response(
                        json.dumps({'message': f'No matching {user_type} found'}),
                        status=404,
                        mimetype='application/json'
                    )

                id = result[0]  # id 값 추출

                # usertype에 따라 schedule 조회
                if user_type == 'customer':
                    schedule_query = """
                        SELECT EXTRACT(DAY FROM session_date) AS date
                        FROM raw_data.pt_schedule
                        WHERE EXTRACT(YEAR FROM session_date) = %s
                        AND EXTRACT(MONTH FROM session_date) = %s
                        AND customer_id = %s;
                    """
                elif user_type == 'trainer':
                    schedule_query = """
                        SELECT EXTRACT(DAY FROM session_date) AS date
                        FROM raw_data.pt_schedule
                        WHERE EXTRACT(YEAR FROM session_date) = %s
                        AND EXTRACT(MONTH FROM session_date) = %s
                        AND trainer_id = %s;
                    """
                else:
                    logging.error("Invalid usertype provided")
                    return Response(
                        json.dumps({'message': 'Invalid usertype provided'}),
                        status=400,
                        mimetype='application/json'
                    )

                cursor.execute(schedule_query, (session_year, session_month, id))
                schedules = cursor.fetchall()

                # 결과를 리스트로 변환
                dates = []
                for schedule in schedules:
                    dates.append({
                        "date": schedule[0]
                    })

                # 결과 반환
                return Response(
                    json.dumps({'message': 'Read monthly schedule successful', 'userType': user_type, 'dates': dates}),
                    status=200,
                    mimetype='application/json'
                )

            except Exception as e:
                return Response(
                    json.dumps({'message': f'An error occurred: {e}'}),
                    status=500,
                    mimetype='application/json'
                )

        #trainer name search