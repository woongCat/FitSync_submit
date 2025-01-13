from flask import Response, request
import json
from db_connection import DatabaseConnection
import bcrypt
from token_utility import TokenUtility
from datetime import datetime

class Auth:
    def __init__(self, app):
        self.app = app
        self.register_routes()

    def register_routes(self):
        @self.app.route('/signup', methods=['POST'])
        def signup():
            try:
                # user info
                data = request.json
                email = data.get('email')
                password = data.get('password') # todo : 암호화 작업
                name = data.get('name')
                usertype = data.get('userType')
                dob = data.get('dob')
                phone_number = data.get('phoneNumber')

                # check user info filled
                if not email or not password or not name or not usertype or not dob or not phone_number:
                    return Response(json.dumps({'message': 'Email, password, name, dob, phone_number and usertype are required'}), status=400, mimetype='application/json')

                # dob 문자열을 DATE 형식으로 변환
                try:
                    dob_date = datetime.strptime(dob, '%Y-%m-%d').date()
                except ValueError:
                    return Response(
                        json.dumps({'message': 'Invalid date format. Use yyyy-mm-dd.'}),
                        status=400,
                        mimetype='application/json'
                    )
                # 비밀번호 암호화
                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # before signup - email check
                query = "SELECT email FROM credential.user_auth WHERE email = %s"
                cursor.execute(query, (email,))
                if cursor.fetchone():
                    return Response(json.dumps({'message': 'User Email already exists'}), status=409, mimetype='application/json')

                # usertype에 따라 추가 테이블에 삽입
                if usertype == "trainer":
                    trainer_query = """
                    INSERT INTO raw_data.trainer (name, email, dob, phone_number)
                    VALUES (%s, %s, %s, %s)
                    RETURNING trainer_id
                    """
                    cursor.execute(trainer_query, (name, email, dob_date, phone_number))
                    id = cursor.fetchone()[0]

                elif usertype == "customer":
                    customer_query = """
                    INSERT INTO raw_data.customer (name, email, dob, phone_number)
                    VALUES (%s, %s, %s, %s)
                    RETURNING customer_id
                    """
                    cursor.execute(customer_query, (name, email, dob_date, phone_number))
                    id = cursor.fetchone()[0]

                # signup
                insert_query = """
                INSERT INTO credential.user_auth (email, password, usertype, name, id)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING user_id
                """
                cursor.execute(insert_query, (email, hashed_password.decode('utf-8'), usertype.lower(), name, id))
                user_id = cursor.fetchone()[0]


                connection.commit()

                return Response(json.dumps({'message': 'User registered successfully', 'id': user_id}), status=201, mimetype='application/json')

            except Exception as e:
                return Response(json.dumps({'message': f'An error occurred: {e}'}), status=500, mimetype='application/json')


        @self.app.route('/login', methods=['POST'])
        def login():
            try:
                # Get User Auth
                data = request.json
                email = data.get('email')
                password = data.get('password')
                usertype = data.get('userType')

                # check user info filled
                if not email or not password or not usertype:
                    return Response(json.dumps({'message': 'Email, password, and usertype are required'}), status=400, mimetype='application/json')

                connection = DatabaseConnection.get_connection()
                cursor = connection.cursor()

                # Get user information
                query = """
                SELECT email, password, usertype, user_id, id, name
                FROM credential.user_auth
                WHERE email = %s
                """
                cursor.execute(query, (email,))
                user = cursor.fetchone()

                # User existence check
                if not user:
                    return Response(json.dumps({'message': 'User not found'}), status=404, mimetype='application/json')

                # user info unpack
                user_email, hashed_password, db_usertype, user_id, id, user_name = user

                # Password check
                if not bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
                    return Response(json.dumps({'message': 'Invalid password'}), status=401, mimetype='application/json')

                # Usertype check
                if db_usertype.lower() != usertype.lower():
                    return Response(json.dumps({'message': f'usertype mismatch for {usertype}'}), status=403, mimetype='application/json')

                # check가 완료된 후 jwt 생성 코드 추가해야 함
                # JWT 생성 (만료 시간 1시간)
                # Create tokens
                # cherck된 user info를 Token화시켜 생성함
                access_token = TokenUtility.generate_access_token(user_id, user_name, db_usertype)
                refresh_token = TokenUtility.generate_refresh_token(user_id, user_name, db_usertype)

                return Response(json.dumps({
                    'message': 'Login successful',
                    'name' : user_name,
                    'userId' : user_id,
                    'id' : id,
                    'usertype' : db_usertype,
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }), status=200, mimetype='application/json')


            except Exception as e:
                return Response(json.dumps({'message': f'An error occurred: {e}'}), status=500, mimetype='application/json')

