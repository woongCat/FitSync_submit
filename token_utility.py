from flask import Response, jsonify
import json
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from datetime import timedelta
import jwt
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)

# JWT Secret Key 및 알고리즘 설정
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")


class TokenUtility:
    def __init__(self, app):
        self.app = app
        self.register_routes()

    def register_routes(self):
        @self.app.route('/refresh', methods=['POST'])
        @jwt_required(refresh=True)  # 리프레시 토큰이 필요
        def refresh():
            try:
                # 현재 사용자 정보 가져오기
                current_user = get_jwt_identity()

                # 새 액세스 토큰 발급
                new_access_token = create_access_token(
                    identity=current_user,
                    expires_delta=timedelta(minutes=30)  # 새 액세스 토큰 30분
                )

                return Response(json.dumps({
                    'access_token': new_access_token
                }), status=200, mimetype='application/json')

            except Exception as e:
                return Response(json.dumps({'message': f'An error occurred: {e}'}), status=500, mimetype='application/json')

    @staticmethod
    def generate_access_token(user_id, user_name, db_usertype):
        identity = f"user_{user_id}"  # 문자열로 설정
        additional_claims = {"name": user_name, "usertype": db_usertype}
        return create_access_token(
            identity=identity,
            additional_claims=additional_claims,
            expires_delta=timedelta(hours=1)
        )

    @staticmethod
    def generate_refresh_token(user_id, user_name, db_usertype):
        identity = f"user_{user_id}"  # 문자열로 설정
        additional_claims = {"name": user_name, "usertype": db_usertype}
        return create_refresh_token(
            identity=identity,
            additional_claims=additional_claims,
            expires_delta=timedelta(days=7)
        )

    @staticmethod
    def decode_from_token(access_token):
        try:
            logging.error("decode_token function in")
            logging.error(f"[DEBUG] access_token -> Type: {type(access_token).__name__}, Value: {access_token}")
            if isinstance(access_token, str):
                access_token = access_token.encode('utf-8')  # Convert to bytes

            # Decode the token using jwt.decode
            decoded_data = jwt.decode(
                access_token,
                SECRET_KEY,
                algorithms=[ALGORITHM],
                options={"verify_exp": False}
            )
            logging.error(f"Decoded Token Payload: {decoded_data}")

            # Extract fields from the token payload
            identity = decoded_data.get("sub")  # sub contains identity
            if not isinstance(identity, str):
                logging.error(f"sub is not a string: {identity}")
                return jsonify({"message": "Invalid token: sub must be a string"}), 400

            claims = decoded_data  # Additional claims
            logging.error(f"Decoded Claims: {claims}")

            # Parse identity and claims
            user_id = identity.split("_")[1]  # Extract user_id from identity
            name = claims.get("name")
            user_type = claims.get("usertype")

            logging.error(f"Extracted data: user_id={user_id}, name={name}, user_type={user_type}")

            return user_id, name, user_type

        except jwt.ExpiredSignatureError:
            logging.error("Token has expired")
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            logging.error(f"Invalid token error: {e}")
            return jsonify({"message": "Invalid token"}), 401
        except Exception as e:
            logging.error(f"Unexpected error during token decoding: {e}")
            return jsonify({"message": f"Unexpected error: {e}"}), 500