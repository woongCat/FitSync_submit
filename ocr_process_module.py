import requests
import json
import os
import uuid
import time
from dotenv import load_dotenv
from difflib import get_close_matches
import pandas as pd
from openai import OpenAI
import logging

logging.basicConfig(level=logging.INFO)

# .env 파일 로드
load_dotenv()

class OCRClient:
    def __init__(self):
        """
        OCRClient 초기화. .env 파일에서 API URL 및 Secret Key를 로드합니다.
        """
        self.api_url = os.getenv("OCR_API_URL")
        self.secret_key = os.getenv("OCR_SECRET_KEY")

        if not self.api_url or not self.secret_key:
            raise ValueError("API_URL 또는 SECRET_KEY가 .env 파일에 설정되어 있지 않습니다.")

    def get_ocr_response(self, file_path: str) -> dict:
        """
        OCR API를 호출하여 결과를 반환하는 메서드.

        Args:
            file_path (str): OCR 처리를 요청할 파일 경로.

        Returns:
            dict: OCR API 응답 데이터.
        """
        # 요청 데이터 생성
        request_json = {
            'images': [
                {
                    'format': 'pdf', # 여기 pdf형식이 아닌 다른 형식일 수도 있음 # 다른 양식이어도 큰 의미가 없는 모양
                    'name': 'demo'
                }
            ],
            'requestId': str(uuid.uuid4()),
            'version': 'V2',
            'timestamp': int(round(time.time() * 1000))
        }

        logging.error("client task1 - make_json")

        # 파일과 헤더 설정
        files = [('file', open(file_path, 'rb'))]
        payload = {'message': json.dumps(request_json)}
        headers = {'X-OCR-SECRET': self.secret_key}

        logging.error("client task2 - make_file, header")

        # API 요청
        response = requests.post(self.api_url, headers=headers, data=payload, files=files)

        logging.error("client task3 - make response")
        logging.error(f"{response}")

        # 응답 처리
        if response.status_code == 200:
            logging.error("client task4 - response clear")
            return response.json()
        else:
            raise Exception(f"Error {response.status_code}: {response.text}")

class OpenAiExtractor:
    """
    A class to encapsulate the logic for extracting workout data from JSON using OpenAI API.
    """

    def __init__(self, model="gpt-4o", temperature=0, max_tokens=1500):
        """
        Initializes the WorkoutDataExtractor with the OpenAI client and parameters.

        Args:
            model (str): OpenAI model to use. Default is "gpt-4o".
            temperature (float): Sampling temperature. Default is 0.
            max_tokens (int): Maximum number of tokens in the output. Default is 500.
        """
        # Load the .env file and initialize OpenAI client
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OpenAI API Key가 설정되지 않았습니다. .env 파일을 확인하세요.")
        self.client = OpenAI(api_key=api_key)
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    def extract_coordinates_and_text(self,ocr_data: dict) -> list:
        extracted_data = []

        for image in ocr_data.get("images", []):
            for field in image.get("fields", []):
                text = field.get("inferText", "")
                vertices = field.get("boundingPoly", {}).get("vertices", [])

                if vertices:
                    x_values = [vertex.get("x", 0) for vertex in vertices]
                    y_values = [vertex.get("y", 0) for vertex in vertices]
                    avg_x = sum(x_values) / len(x_values) if x_values else 0
                    avg_y = sum(y_values) / len(y_values) if y_values else 0

                    extracted_data.append({
                        "text": text,
                        "avg_pos": (avg_x, avg_y)
                    })

        return extracted_data

    def extract_workout_data(self, json_data):
        """
        Extracts workout data (exercise, weight, repetitions, sets) using OpenAI API.

        Args:
            json_data (json): JSON data containing workout information.

        Returns:
            dict: Extracted workout data.
        """
        messages = [
            {
                "role": "system",
                "content": (
                    "당신은 사용자가 제공한 데이터에서 운동 정보를 추출하고 가공하는 도우미입니다. 운동 정보에는 운동 이름(`exercise`), 무게(`weight`), 반복 횟수(`reps`), 세트 수(`sets`), 코멘트(`comment`)가 포함됩니다. 다음 규칙을 따르세요:"
                    "1. 무게(`weight`)와 반복 횟수(`reps`)는 반드시 리스트 형태로 반환하세요."
                    "2. 세트 수(`sets`) 값이 0이면, `weight`와 `reps`는 빈 리스트(`[]`)로 반환하세요."
                    "3. 세트 수(`sets`) 값이 N(1 이상)이라면, `weight`와 `reps` 리스트는 정확히 N개의 값을 가져야 합니다."
                    "- 만약 리스트가 N보다 길다면 초과된 값을 제거하세요."
                    "- 만약 리스트가 N보다 짧다면 리스트를 N개의 값으로 맞추고, 부족한 값은 0으로 채우세요."
                    "4. 무게, 반복 횟수, 세트 값에서 '5'가 문맥상 'S'로 잘못 인식된 경우, '5'로 수정하세요."
                    "5. 숫자 이외의 값(예: 'kg')이 포함된 경우, 숫자만 남기세요."
                    "6. 결과는 반드시 JSON 배열 형식으로만 반환하세요. 추가적인 텍스트는 절대 포함하지 마세요."
                    """
                    결과는 다음 형식과 유사해야 합니다:
                    ```json
                    [
                    {
                        "exercise": "덤벨 레이즈",
                        "weight": [10, 15, 0],
                        "reps": [10, 12, 15],
                        "sets": 2,
                        "comment": "Good!"
                    },
                    {
                        "exercise": "바벨 스쿼트",
                        "weight": [],
                        "reps": [],
                        "sets": 0,
                        "comment": "세트 없음"
                    }
                    ]
                    """
                )
            },
            {
                "role": "user",
                "content": (
                    f"다음은 OCR을 통해 추출된 운동 기록 데이터입니다. "
                    f"운동, 무게, 반복 횟수, 세트 수, 코멘트를 JSON 배열 형식으로만 반환해주세요: {json_data}"
                )
            },
        ]

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
            )
            response_content = response.choices[0].message.content
            return response_content
        except AttributeError:
            raise AttributeError("오류: 응답 객체에서 메시지를 제대로 추출하지 못했습니다.")
        except Exception as e:
            raise Exception(f"예상치 못한 오류가 발생했습니다: {e}")

    def run(self, json_data):
        """
        Main function to extract workout data from a JSON file.

        Args:
            json_data (list): json_data from ocr results.
        """
        # Read JSON file
        list_data = self.extract_coordinates_and_text(json_data)
        logging.error("ai task1 - read json")

        # Extract workout data using OpenAI API
        extracted_data = self.extract_workout_data(list_data)
        logging.error("ai task2 - extract workout")

        strip_dict = extracted_data.strip("```json").strip()

        json_data = json.loads(strip_dict)

        return json_data

class ExerciseMatcher:
    def __init__(self, csv_file_path, threshold=0.2):
        """
        ExerciseMatcher 초기화.

        Args:
            csv_file_path (str): CSV 파일 경로 (exercise_id와 name 포함).
            threshold (float): 유사도 기준 (default: 0.2).
        """
        self.csv_file_path = csv_file_path
        self.threshold = threshold
        self.db_data = self._load_csv_data()

    def _load_csv_data(self):
        """
        CSV 파일을 읽어 데이터프레임으로 반환.

        Returns:
            DataFrame: 운동 데이터 (exercise_id와 name 포함).
        """
        try:
            return pd.read_csv(self.csv_file_path)
        except FileNotFoundError:
            raise FileNotFoundError(f"CSV 파일 {self.csv_file_path}을(를) 찾을 수 없습니다.")

    def find_similar_exercises(self, exercise_name):
        """
        주어진 운동 이름과 비슷한 운동의 ID와 이름을 반환.

        Args:
            exercise_name (str): 찾고자 하는 운동 이름.

        Returns:
            list: 유사한 운동의 ID와 이름 리스트.
        """
        if 'exercise_id' not in self.db_data.columns or 'name' not in self.db_data.columns:
            raise ValueError("CSV 파일에 'exercise_id'와 'name' 열이 포함되어 있어야 합니다.")

        db_names = self.db_data['name'].tolist()
        similar_names = get_close_matches(
            exercise_name, db_names, n=5, cutoff=self.threshold
        )
        similar_exercises = self.db_data[self.db_data['name'].isin(similar_names)][['exercise_id', 'name']].to_dict('records')
        return similar_exercises


    def process_exercise_data(self, data, exercise_matcher):
        """
        주어진 운동 데이터를 처리하고 유사한 운동 ID와 이름으로 대체.

        Args:
            data (list): 운동 데이터 리스트.
            exercise_matcher (ExerciseMatcher): 운동 매칭 객체.

        Returns:
            list: 처리된 운동 데이터 리스트.
        """
        for exercise_entry in data:
            exercise_name = exercise_entry['exercise']
            similar_exercises = exercise_matcher.find_similar_exercises(exercise_name)
            if similar_exercises:
                exercise_entry['exercise_id'] = similar_exercises[0]['exercise_id']
                exercise_entry['exercise'] = similar_exercises[0]['name']
            else:
                exercise_entry['exercise_id'] = None
        return data

