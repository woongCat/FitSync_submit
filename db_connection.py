from dotenv import load_dotenv
import psycopg2
import os
from datetime import date

# 환경 변수 로드
load_dotenv()

class DatabaseConnection:
    @staticmethod
    def get_connection():
        return psycopg2.connect(
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            dbname=os.getenv("DB_NAME")
        )

    @staticmethod
    def json_serial(obj):
        if isinstance(obj, date):
            return obj.isoformat()
        raise TypeError(f"Type {type(obj)} not serializable")
