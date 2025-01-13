from flask import request, Response
import json
from db_connection import DatabaseConnection
import logging
from token_utility import TokenUtility

logging.basicConfig(level=logging.INFO)

class GymAPIHandler:
    def __init__(self, app):
        self.app = app
        self.register_routes()

    def register_routes(self):
        # 1. Read Gym
        @self.app.route('/gym/read', methods=['GET'])
        def read_gym():
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

                logging.error("[read] get gym data")

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

                #auth_id = result[0]  # id 값 추출

                # gym_metadata 내용 가져오기
                cursor.execute("SELECT * FROM raw_data.gym_metadata")
                gym_metadata_raws = cursor.fetchall()

                # gym 데이터를 변환
                gyms = [
                    {
                        "gymId": gym[0],
                        "gymName": gym[1],
                        "gymLocation": gym[2],
                        "gymPhoneNumber": gym[3],
                    }
                    for gym in gym_metadata_raws
                ]

                # 결과 반환
                return Response(
                    json.dumps({'message': 'Read successful', 'data': gyms}),
                    status=200,
                    mimetype='application/json'
                )

            except Exception as e:
                return Response(
                    json.dumps({'message': f'An error occurred: {e}'}),
                    status=500,
                    mimetype='application/json'
                )
