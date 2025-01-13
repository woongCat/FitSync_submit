from flask import Flask
from flask_cors import CORS
from auth import Auth
from data_api import DataAPI
from file_ocr import FileHandler
from record_api_handler import RecordAPIHandler
from schedule_api_handler import ScheduleAPIHandler
from gym_api_handler import GymAPIHandler
from registration_api_handler import RegistrationAPIHandler
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os
from token_utility import TokenUtility

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY") # for token
jwt = JWTManager(app) # jwt 관리자

CORS(app)
Auth(app)
DataAPI(app)
FileHandler(app)
RecordAPIHandler(app)
ScheduleAPIHandler(app)
GymAPIHandler(app)
RegistrationAPIHandler(app)
TokenUtility(app)

if __name__ == '__main__':
    app.run(debug=True)
