from flask import request, Response
import json
from datetime import datetime
from db_connection import DatabaseConnection
import logging
from token_utility import TokenUtility

logging.basicConfig(level=logging.INFO)

class RecordAPIHandler:
    def __init__(self, app):
        self.app = app
        self.register_routes()

    def register_routes(self):
        # 1. Create Record
        @self.app.route('/record/create', methods=['POST'])
        def create_record():
            try:
                # 입력 데이터 수신
                data = request.json

                access_token = request.headers.get('Authorization')
                session_date_str = data.get('sessionDate')  # 문자열로 수신
                routine = data.get('routine')
                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                # 필수 데이터 검증
                if not all([user_id, user_type, session_date_str, routine]):
                    return Response(json.dumps({'message': 'Missing required fields'}), status=400, mimetype='application/json')
                logging.error("[create] get")

                # session_date 문자열을 TIMESTAMP 형식으로 변환
                try:
                    session_date = datetime.strptime(session_date_str, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd HH:MM:SS.'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # 현재 시간으로 created_date 설정
                created_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                # pt_record 삽입
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

                id = result[0]  # customer_id 추출

                # Step 2: raw_data.pt_record에 레코드 삽입
                if user_type == "trainer":
                    insert_query = """
                        INSERT INTO raw_data.pt_record (trainer_id, session_date, created_at)
                        VALUES (%s, %s, %s)
                        RETURNING record_id
                    """
                    cursor.execute(insert_query, (id, session_date, created_date))
                    record_id = cursor.fetchone()[0]

                elif user_type == "customer":
                    insert_query = """
                        INSERT INTO raw_data.pt_record (customer_id, session_date, created_at)
                        VALUES (%s, %s, %s)
                        RETURNING record_id
                    """
                    cursor.execute(insert_query, (id, session_date, created_date))
                    record_id = cursor.fetchone()[0]

                # pt_record_exercise 삽입
                for exercise in routine:
                    exercise_id = exercise["exercise_id"]
                    exercise_name = exercise["exercise_name"]
                    sets = exercise["sets"]
                    reps = exercise["reps"] if isinstance(exercise["reps"], list) else [exercise["reps"]]
                    weight = exercise["weight"] if isinstance(exercise["weight"], list) else [exercise["weight"]]
                    comment = exercise["comment"]

                    cursor.execute("""
                    INSERT INTO raw_data.pt_record_exercise (record_id, exercise_id, sets, reps, weight, notes)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """, (record_id, exercise_id, sets, reps, weight, comment))

                connection.commit()

                # 성공 응답 반환
                return Response(
                    json.dumps({'message': 'Record created', 'record_id': record_id, 'session_date': session_date_str}),
                    status=201,
                    mimetype='application/json'
                )

            except Exception as e:
                return Response(json.dumps({'message': f'An error occurred: {e}'}), status=500, mimetype='application/json')

        # 2. Read Record
        @self.app.route('/record/read', methods=['GET'])
        def read_record():
            try:
                # 입력값 처리
                access_token = request.headers.get('Authorization')
                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                # 필수 입력값 확인
                if not all([user_id, user_type]):
                    return Response(
                        json.dumps({'message': 'Missing required fields'}),
                        status=400,
                        mimetype='application/json'
                    )

                logging.error("[read] get")

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

                # usertype에 따라 record 조회
                if user_type == 'customer':
                    record_query = """
                        SELECT record_id, customer_id, trainer_id, session_date
                        FROM raw_data.pt_record
                        WHERE customer_id = %s
                    """
                elif user_type == 'trainer':
                    record_query = """
                        SELECT record_id, customer_id, trainer_id, session_date
                        FROM raw_data.pt_record
                        WHERE trainer_id = %s
                    """
                else:
                    logging.error("Invalid usertype provided")
                    return Response(
                        json.dumps({'message': 'Invalid usertype provided'}),
                        status=400,
                        mimetype='application/json'
                    )

                cursor.execute(record_query, (auth_id,))
                records = cursor.fetchall()

                result = []
                for record_id, customer_id, trainer_id, session_date in records:
                    # pt_record_exercise에서 관련 루틴 데이터 가져오기
                    cursor.execute("""
                    SELECT exercise_id, sets, reps, weight, notes
                    FROM raw_data.pt_record_exercise
                    WHERE record_id = %s
                    """, (record_id,))
                    exercises = cursor.fetchall()

                    # exercise_id로 exercise_name 가져오기
                    exercise_ids = [row[0] for row in exercises]
                    exercise_names_and_gif_urls = []
                    if exercise_ids:
                        # IN 연산자로 여러 exercise_id에 대한 이름과 gifUrl 가져오기
                        cursor.execute("""
                        SELECT exercise_id, name, gifUrl
                        FROM raw_data.exercise
                        WHERE exercise_id IN %s
                        """, (tuple(exercise_ids),))
                        name_results = cursor.fetchall()

                        # exercise_id를 키로 하여 name과 gifUrl을 매핑하는 딕셔너리 생성
                        exercise_name_dict = {row[0]: {'name': row[1], 'gifUrl': row[2]} for row in name_results}

                        # exercise_ids의 순서를 유지하면서 각 운동의 name과 gifUrl을 가져옴
                        exercise_names_and_gif_urls = [
                            exercise_name_dict.get(exercise_id, {'name': '', 'gifUrl': ''}) for exercise_id in exercise_ids
                        ]

                        # 루틴 데이터 구성
                        routines = []
                        for exercise, name_and_gif in zip(exercises, exercise_names_and_gif_urls):
                            routines.append({
                                "exercise_id": exercise[0],
                                "exercise_name": name_and_gif['name'],  # name
                                "sets": exercise[1],
                                "reps": exercise[2],
                                "weight": exercise[3],
                                "comment": exercise[4],
                                "exercise_gifUrl": name_and_gif['gifUrl'],  # gifUrl 추가
                            })

                    # customer 이름 가져오기
                    cursor.execute("""
                        SELECT name
                        FROM raw_data.customer
                        WHERE customer_id = %s
                    """, (customer_id,))
                    customer_name = cursor.fetchone()

                    # 트레이너 이름 가져오기
                    cursor.execute("""
                        SELECT name
                        FROM raw_data.trainer
                        WHERE trainer_id = %s
                    """, (trainer_id,))
                    trainer_name = cursor.fetchone()

                    # 결과 추가
                    result.append({
                        "recordId": record_id,
                        "customerName": customer_name[0] if customer_name else None,
                        "trainerName": trainer_name[0] if trainer_name else None,
                        "sessionDate": session_date.strftime('%Y-%m-%d %H:%M:%S'),  # 날짜 형식 변환
                        "routines": routines
                    })

                # 결과 반환
                return Response(
                    json.dumps({'message': 'Read successful', 'data': result}),
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
        @self.app.route('/record/update', methods=['PUT'])
        def update_record():
            try:
                # 입력값 처리
                data = request.json

                access_token = request.headers.get('Authorization')
                session_date_str = data.get('sessionDate')
                record_id = data.get('recordId')
                routine = data.get('routine')

                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                # 필수 입력값 확인
                if not all([user_id, user_type, session_date_str, record_id, routine]):
                    return Response(json.dumps({'message': 'Missing required fields'}), status=400, mimetype='application/json')
                logging.error("[update] put")

                # sessionDate를 datetime 객체로 변환
                try:
                    session_date = datetime.strptime(session_date_str, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd HH:MM:SS.'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # pt_record 업데이트
                # Step 1: user_id로 customer_id 조회
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

                id = result[0]  # customer_id 추출

                # Step 2: raw_data.pt_record 업데이트
                if user_type == "trainer":
                    cursor.execute("""
                        UPDATE raw_data.pt_record
                        SET session_date = %s
                        WHERE record_id = %s AND trainer_id = %s
                    """, (session_date, record_id, id))
                elif user_type == "customer":
                    cursor.execute("""
                        UPDATE raw_data.pt_record
                        SET session_date = %s
                        WHERE record_id = %s AND customer_id = %s
                    """, (session_date, record_id, id))

                # pt_record_exercise 업데이트 또는 삽입
                cursor.execute("""
                SELECT exercise_id FROM raw_data.pt_record_exercise
                WHERE record_id = %s
                """, (record_id,))
                current_exercise_ids = {row[0] for row in cursor.fetchall()}  # 현재 데이터베이스에 있는 exercise_id 목록

                # 새로 들어온 exercise_id 목록
                new_exercise_ids = {exercise["exercise_id"] for exercise in routine}

                # 삭제 대상 계산
                exercise_ids_to_delete = current_exercise_ids - new_exercise_ids

                # 삭제 대상 제거
                if exercise_ids_to_delete:
                    cursor.execute("""
                    DELETE FROM raw_data.pt_record_exercise
                    WHERE record_id = %s AND exercise_id = ANY(%s)
                    """, (record_id, list(exercise_ids_to_delete)))

                # 삽입 또는 업데이트 작업
                for exercise in routine:
                    exercise_id = exercise["exercise_id"]
                    exercise_name = exercise["exercise_name"]
                    sets = exercise["sets"]
                    reps = exercise["reps"] if isinstance(exercise["reps"], list) else [exercise["reps"]]
                    weight = exercise["weight"] if isinstance(exercise["weight"], list) else [exercise["weight"]]
                    comment = exercise["comment"]

                    # 기존 데이터가 존재하는지 확인
                    cursor.execute("""
                    SELECT record_id FROM raw_data.pt_record_exercise
                    WHERE record_id = %s AND exercise_id = %s
                    """, (record_id, exercise_id))
                    existing_record = cursor.fetchone()

                    if existing_record:
                        # 기존 데이터 업데이트
                        cursor.execute("""
                        UPDATE raw_data.pt_record_exercise
                        SET sets = %s, reps = %s, weight = %s, notes = %s
                        WHERE record_id = %s AND exercise_id = %s
                        """, (sets, reps, weight, comment, record_id, exercise_id))
                    else:
                        # 새로운 데이터 삽입
                        cursor.execute("""
                        INSERT INTO raw_data.pt_record_exercise (record_id, exercise_id, sets, reps, weight, notes)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        """, (record_id, exercise_id, sets, reps, weight, comment))

                connection.commit()

                # 성공 응답
                return Response(
                    json.dumps({'message': 'Record updated successfully'}),
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
        @self.app.route('/record/delete', methods=['DELETE'])
        def delete_record():
            try:
                data = request.json

                access_token = request.headers.get('Authorization')

                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                session_date_str = data.get('sessionDate')
                record_id = data.get('recordId')

                if not all([user_id, user_type, session_date_str, record_id]):
                    return Response(
                        json.dumps({'message': 'Missing required fields'}),
                        status=400,
                        mimetype='application/json'
                    )

                try:
                    session_date = datetime.strptime(session_date_str, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd HH:MM:SS.'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # 1. pt_record_exercise에서 레코드 삭제
                cursor.execute("DELETE FROM raw_data.pt_record_exercise WHERE record_id = %s", (record_id,))

                # 2. pt_record에서 레코드 삭제
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

                id = result[0]  # customer_id 추출

                # raw_data.pt_record에서 레코드 삭제
                if user_type == "trainer":
                    cursor.execute("""
                        DELETE FROM raw_data.pt_record
                        WHERE record_id = %s AND trainer_id = %s AND session_date = %s
                    """, (record_id, id, session_date))
                elif user_type == "customer":
                    cursor.execute("""
                        DELETE FROM raw_data.pt_record
                        WHERE record_id = %s AND customer_id = %s AND session_date = %s
                    """, (record_id, id, session_date))

                connection.commit()

                return Response(
                    json.dumps({'message': 'Record deleted successfully'}),
                    status=200,
                    mimetype='application/json'
                )

            except Exception as e:
                return Response(
                    json.dumps({'message': f'An error occurred: {e}'}),
                    status=500,
                    mimetype='application/json'
                )

        # 5. Update Record UserID
        @self.app.route('/record/update/id', methods=['PUT'])
        def update_record_id():
            try:
                # 입력값 처리
                data = request.json

                access_token = request.headers.get('Authorization')
                session_date_str = data.get('sessionDate')
                record_id = data.get('recordId')
                sharing_user_id = data.get('sharedUserId')

                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                # 필수 입력값 확인
                if not all([user_id, user_type, session_date_str, record_id, sharing_user_id]):
                    return Response(json.dumps({'message': 'Missing required fields'}), status=400, mimetype='application/json')
                logging.error("[update] put")

                # sessionDate를 datetime 객체로 변환
                try:
                    session_date = datetime.strptime(session_date_str, '%Y-%m-%d %H:%M:%S')
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd HH:MM:SS.'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # pt_record 업데이트
                # Step 1: user_id로 customer_id 조회
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

                auth_id = result[0]  # customer_id 추출

                # Step 2: raw_data.pt_record 업데이트
                if user_type == "customer":
                    cursor.execute("""
                        UPDATE raw_data.pt_record
                        SET trainer_id = %s
                        WHERE record_id = %s AND session_date = %s AND customer_id = %s
                    """, (sharing_user_id, record_id, session_date, auth_id))
                elif user_type == "trainer":
                    cursor.execute("""
                        UPDATE raw_data.pt_record
                        SET customer_id = %s
                        WHERE record_id = %s AND session_date = %s AND trainer_id = %s
                    """, (sharing_user_id, record_id, session_date, auth_id))
                else :
                    logging.error("No matching user type for the given user_id")
                    return Response(
                        json.dumps({'message': 'No matching user type found'}),
                        status=404,
                        mimetype='application/json'
                    )

                connection.commit()

                # 성공 응답
                return Response(
                    json.dumps({'message': 'Record updated successfully'}),
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