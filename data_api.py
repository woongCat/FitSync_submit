from flask import Response, render_template_string, request, redirect, url_for
import json
from db_connection import DatabaseConnection
from datetime import date

class DataAPI:
    def __init__(self, app):
        self.app = app
        self.allowed_tables = {"customer", "trainer", "exercise", "gym_metadata", "pt_record", "pt_record_exercise", "pt_schedule"}
        self.register_routes()

    # JSON 직렬화 시 날짜 및 기타 객체 처리
    @staticmethod
    def json_serial(obj):
        if isinstance(obj, (date,)):
            return obj.isoformat()  # 날짜를 ISO 형식(YYYY-MM-DD) 문자열로 변환
        raise TypeError(f"Type {type(obj)} not serializable")

    # 데이터 조회 함수
    def get_data(self, table_name):
        connection = DatabaseConnection.get_connection()
        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM raw_data.{table_name}")
        rows = cursor.fetchall()

        # 컬럼 이름 가져오기
        column_names = [desc[0] for desc in cursor.description]

        # 데이터를 JSON 형식으로 변환
        result = [dict(zip(column_names, row)) for row in rows]

        connection.close()

        # JSON 응답 반환 (한글 출력 및 날짜 직렬화 처리)
        return Response(
            json.dumps(result, ensure_ascii=False, default=self.json_serial),  # 직렬화 방식 수정
            mimetype='application/json'
        )

    def register_routes(self):
        @self.app.route('/', methods=['GET', 'POST'])
        def home():
            if request.method == 'POST':
                table_name = request.form.get('table_name')
                # 허용된 테이블 이름 목록 (SQL Injection 방지)
                if table_name in self.allowed_tables:
                    # 입력된 값을 기반으로 해당 API 경로로 리디렉션
                    return redirect(url_for('get_table_data', table_name=table_name))
                else:
                    return Response(json.dumps({"error": "Invalid table name"}, ensure_ascii=False), 400, mimetype='application/json')

            # HTML 폼
            form_html = '''
            <!DOCTYPE html>
            <html>
            <head>
                <title>API Data Fetcher</title>
            </head>
            <body>
                <h1>Enter Table Name</h1>
                <form method="POST">
                    <label for="table_name">Table Name:</label>
                    <input type="text" id="table_name" name="table_name" required>
                    <button type="submit">Fetch Data</button>
                </form>
            </body>
            </html>
            '''
            return render_template_string(form_html)

        # 각 테이블에 대한 API 엔드포인트 정의
        @self.app.route('/api/data/<table_name>', methods=['GET'])
        def get_table_data(table_name):
            if table_name not in self.allowed_tables:
                return Response(json.dumps({"error": "Invalid table name"}, ensure_ascii=False), 400, mimetype='application/json')
            return self.get_data(table_name)
