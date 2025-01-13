from flask import request, Response
import json
from db_connection import DatabaseConnection
import logging
from token_utility import TokenUtility

logging.basicConfig(level=logging.INFO)

class RegistrationAPIHandler:
    def __init__(self, app):
        self.app = app
        self.register_routes()

    def register_routes(self):
        # 1. Read Registration Information
        @self.app.route('/registration/read', methods=['GET'])
        def read_registration():
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

                logging.error("[read registration] get")

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

                # usertype에 따라 gym_id를 가져오기 위한 정보 조회
                if user_type == 'customer':
                    gym_id_query = """
                        SELECT gym_id
                        FROM raw_data.customer
                        WHERE customer_id = %s
                    """
                elif user_type == 'trainer':
                    gym_id_query = """
                        SELECT gym_id
                        FROM raw_data.trainer
                        WHERE trainer_id = %s
                    """
                else:
                    logging.error("Invalid usertype provided")
                    return Response(
                        json.dumps({'message': 'Invalid usertype provided'}),
                        status=400,
                        mimetype='application/json'
                    )

                cursor.execute(gym_id_query, (auth_id,))
                gym_id_data = cursor.fetchone()
                gym_id = gym_id_data[0] # `fetchone()` 결과는 튜플이므로 첫 번째 값 추출

                # gym_id가 없으면 빈 값 응답
                gym_trainers = []
                gym_customers = []
                if not gym_id:
                    response_data = {
                        'userType': user_type,
                        'gym': None,
                        'gymTrainers': gym_trainers,  # 트레이너 정보가 없으므로 빈 배열
                        'gymCustomers': gym_trainers  # 고객 정보가 없으므로 빈 배열
                    }
                    # 결과 반환
                    return Response(
                        json.dumps({'message': 'No gym data', 'data': response_data}),
                        status=200,
                        mimetype='application/json'
                    )
                else:
                    # gym_id 값이 있다면
                    # 해당 gym_id를 갖는 gym_metadata 조회
                    gym_metadata_query = """
                        SELECT *
                        FROM raw_data.gym_metadata
                        WHERE gym_id = %s
                    """
                    cursor.execute(gym_metadata_query, (gym_id,))
                    gym_metadata_row = cursor.fetchone()
                    gym_metadata = {
                        "gymId": gym_metadata_row[0],
                        "gymName": gym_metadata_row[1],
                        "gymLocation": gym_metadata_row[2],
                        "gymPhoneNumber": gym_metadata_row[3],
                    }

                    # 해당 Gym에 관련된 사람 조회하기
                    if user_type == 'customer':
                        # user_type = 'customer'면,
                        # 자신의 tariner id 가져오기
                        find_trainer_id_query = """
                            SELECT trainer_id
                            FROM raw_data.customer
                            WHERE customer_id = %s
                        """
                        cursor.execute(find_trainer_id_query, (auth_id,))
                        find_trainer_id_row = cursor.fetchone()
                        my_trainer_id = find_trainer_id_row[0] or None

                        # 해당 gym_id에 소속된 Trainer 정보 가져오기
                        related_trainers_query = """
                            SELECT
                                t.trainer_id AS "trainerId",
                                t.name AS "trainerName",
                                t.specialty AS "trainerSpeciality",
                                COALESCE(
                                    CONCAT(a.title, ' (', EXTRACT(YEAR FROM a.date_awarded), ')'),
                                    NULL
                                ) AS "trainerRecentAward",
                                COALESCE(
                                    CONCAT(c.name, ' (', EXTRACT(YEAR FROM c.date_issued), ')'),
                                    NULL
                                ) AS "trainerRecentCertification",
                                CASE
                                    WHEN t.trainer_id = %s THEN TRUE
                                    ELSE FALSE
                                END AS "trainerSelected"
                            FROM
                                raw_data.trainer t
                            LEFT JOIN (
                                SELECT trainer_id, title, date_awarded
                                FROM raw_data.award
                                WHERE (trainer_id, date_awarded) IN (
                                    SELECT trainer_id, MAX(date_awarded)
                                    FROM raw_data.award
                                    GROUP BY trainer_id
                                )
                            ) a ON t.trainer_id = a.trainer_id
                            LEFT JOIN (
                                SELECT trainer_id, name, date_issued
                                FROM raw_data.certification
                                WHERE (trainer_id, date_issued) IN (
                                    SELECT trainer_id, MAX(date_issued)
                                    FROM raw_data.certification
                                    GROUP BY trainer_id
                                )
                            ) c ON t.trainer_id = c.trainer_id
                            WHERE
                                t.gym_id = %s;
                            """

                        cursor.execute(related_trainers_query, (my_trainer_id, gym_id))  # 파라미터 순서
                        related_trainers_row = cursor.fetchall()

                        gym_trainers = [
                            {
                                "trainerId": row[0],
                                "trainerName": row[1],
                                "trainerSpeciality": row[2],
                                "trainerRecentAward": row[3],
                                "trainerRecentCertification": row[4],
                                "trainerSelected": row[5]
                            }
                            for row in related_trainers_row
                        ]

                    elif user_type == 'trainer':
                        # user_type = 'trainer'면, 해당 gym_id에 소속되 있으면 자신의 trainer_id를 갖는 customer 정보 가져오기
                        related_customers_query = """
                            SELECT
                                customer_id,
                                name,
                                subscription_type
                            FROM raw_data.customer
                            WHERE gym_id = %s AND trainer_id = %s
                        """
                        cursor.execute(related_customers_query, (gym_id, auth_id))
                        related_customers_row = cursor.fetchall()

                        gym_customers = [
                            {
                                "customerId": row[0],
                                "customerName": row[1],
                                "customerPTType": row[2],
                            }
                            for row in related_customers_row
                        ]
                    else:
                        logging.error("Invalid usertype provided")
                        return Response(
                            json.dumps({'message': 'Invalid usertype provided'}),
                            status=400,
                            mimetype='application/json'
                        )

                    logging.error(f"[update registration] data - userType: {user_type}")
                    logging.error(f"[update registration] data - gym_id: {gym_id}")

                    # 가져온 데이터들을 json 형식에 맞게 변환
                    response_data = {
                        'userType': user_type,
                        'gym': gym_metadata,
                        'gymTrainers': gym_trainers,
                        'gymCustomers': gym_customers
                    }

                    # 결과 반환
                    return Response(
                        json.dumps({'message': 'Read successful', 'data': response_data}),
                        status=200,
                        mimetype='application/json'
                    )

            except Exception as e:
                return Response(
                    json.dumps({'message': f'An error occurred: {e}'}),
                    status=500,
                    mimetype='application/json'
                )


        # 2. Update Registration
        @self.app.route('/registration/update', methods=['PUT'])
        def update_registration():
            try:
                # 입력값 처리
                access_token = request.headers.get('Authorization')
                update_type = request.json.get('updateType') # 어떤 부분을 수정할 것인지
                update_data = request.json.get('updateData') # 수정 할 값

                if access_token and access_token.startswith("Bearer "):
                    access_token = access_token.split(" ")[1]  # "Bearer " 제거
                user_id, name, user_type = TokenUtility.decode_from_token(access_token)

                # 필수 입력값 확인
                if not all([user_id, user_type, update_type, update_data]):
                    return Response(json.dumps({'message': 'Missing required fields'}), status=400, mimetype='application/json')

                logging.error("[update registration] put")

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # 해당 user_id 로 존재 조회
                auth_query = """
                    SELECT id
                    FROM credential.user_auth
                    WHERE user_id = %s AND usertype = %s
                """
                cursor.execute(auth_query, (user_id, user_type))
                result = cursor.fetchone()

                auth_id = result[0]  # customer_id 추출

                if not result:
                    logging.error("No matching customer found for the given user_id")
                    return Response(
                        json.dumps({'message': 'No matching customer found'}),
                        status=404,
                        mimetype='application/json'
                    )

                # 1. update_content = 'gym'인 경우
                # user_type에 맞춰서 gym_id 업데이트
                if (update_type == 'gym') :
                    if (user_type == 'customer') :
                        logging.error(f"[update registration] update data : {update_data} / user_id : {auth_id}")
                        cursor.execute("""
                            UPDATE raw_data.customer
                            SET gym_id = %s, trainer_id = NULL
                            WHERE customer_id = %s
                        """, (update_data, auth_id))
                    elif (user_type == 'trainer') :
                        cursor.execute("""
                            UPDATE raw_data.trainer
                            SET gym_id = %s
                            WHERE trainer_id = %s
                        """, (update_data, auth_id))
                        cursor.execute("""
                            UPDATE raw_data.customer
                            SET trainer_id = NULL
                            WHERE trainer_id = %s AND gym_id = %s
                        """, (auth_id, update_data))
                    else :
                        logging.error("Invalid usertype provided")
                        return Response(
                            json.dumps({'message': 'Invalid usertype provided to update gym_id'}),
                            status=400,
                            mimetype='application/json'
                        )
                # 2. update_content = 'trainer'인 경우
                # user_type이 customer임을 확인 후 해당 user의 trainer id 변경
                elif (update_type == 'trainer' and user_type == 'customer') :
                    cursor.execute("""
                        UPDATE raw_data.customer
                        SET trainer_id = %s
                        WHERE customer_id = %s
                    """, (update_data, auth_id))
                # 3. update_content = 'customer'인 경우
                # user_type이 trainer임을 확인 후 받아온 customer id의 해당하는 user의 trainer id 빈칸 처리
                elif (update_type == 'customer' and user_type == 'trainer') :
                    cursor.execute("""
                        UPDATE raw_data.customer
                        SET trainer_id = NULL
                        WHERE customer_id = %s
                    """, (update_data,))
                # 그 외 경우 실패 응답
                else :
                    return Response(
                        json.dumps({'message': 'Content-type is not right to process.'}),
                        status=400,
                        mimetype='application/json'
                    )

                connection.commit()

                # 성공 응답
                return Response(
                    json.dumps({'message': 'Update is done successfully'}),
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