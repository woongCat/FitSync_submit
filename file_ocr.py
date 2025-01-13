from flask import Response, request, jsonify
import os
from werkzeug.utils import secure_filename
import json
from ocr_process_module import OCRClient, OpenAiExtractor, ExerciseMatcher
import logging

logging.basicConfig(level=logging.INFO)

class FileHandler:
    def __init__(self, app):
        self.app = app
        self.allowed_extensions = {"png", "jpg", "jpeg", "pdf"}
        self.upload_folder = './uploads'
        self.register_routes()

        # 업로드 폴더 생성
        if not os.path.exists(self.upload_folder):
            os.makedirs(self.upload_folder)

    @staticmethod
    def allowed_file(filename):
        """파일 확장자 검증"""
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in {"png", "jpg", "jpeg", "pdf"}

    def handle_file_upload(self, file):
        """파일 저장 및 경로 반환"""
        filename = secure_filename(file.filename)
        file_path = os.path.join(self.upload_folder, filename)
        file.save(file_path)
        return file_path

    def register_routes(self):
        @self.app.route('/upload', methods=['GET','POST'])
        def upload_file():
            """파일 업로드 및 OCR 처리"""
            if 'file' not in request.files:
                return Response(json.dumps({"error": "No file uploaded"}, ensure_ascii=False), 400, mimetype='application/json')
            logging.error("task0 - file transport")
            file = request.files['file']
            if not file or file.filename == '':
                return Response(json.dumps({"error": "No file uploaded"}, ensure_ascii=False), 400, mimetype='application/json')
            if not self.allowed_file(file.filename):
                return Response(json.dumps({"error": "Invalid file type"}, ensure_ascii=False), 400, mimetype='application/json')

            try:
                # task - 1. 사진 파일을 받는 부분
                file_path = self.handle_file_upload(file)
                logging.error("task1 - file_path")

                # 네이버 OCR api를 통해 json파일을 받는 부분
                # 파일을 저장하지 않고 메모리에서 바로 처리
                ocr_client = OCRClient()
                ocr_result = ocr_client.get_ocr_response(file_path)
                logging.error("task2 - ocr_result")

                # open ai api 호출을 통해 전처리
                ai = OpenAiExtractor()
                exercise_data = ai.run(ocr_result)
                logging.error("task3 - ai preprocessing")

                # 처리된 OCR 데이터 운동과 매칭
                csv_file_path = "/home/onederthesea/FitSync_backend/exercise_data.csv"
                exercise_matcher = ExerciseMatcher(csv_file_path, threshold=0.2) # 이 부분 csv파일이 아닌 데이터베이스에서 읽는 부분으로 바꿔야 함.
                logging.error("task4 - csv load")
                processed_results = exercise_matcher.process_exercise_data(exercise_data, exercise_matcher)
                logging.error("task5 - exercise_matcher")

                # 처리 결과 반환
                return jsonify({"text": processed_results})
            except Exception as e:
                return Response(json.dumps({"error": f"OCR processing failed: {str(e)}"}, ensure_ascii=False), 500, mimetype='application/json')