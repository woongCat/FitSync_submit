import requests
import csv
import os
import xml.etree.ElementTree as ET
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.models import Variable
from datetime import datetime, timedelta
from io import StringIO
import boto3
import logging


# API 설정
DATA_BASE_URL = Variable.get('DATA_BASE_URL')
DATA_API_KEY = Variable.get('DATA_API_KEY')
OUTPUT_TYPE = "xml"  # 응답 형식: xml
SERVICE_NAME = "LOCALDATA_104201"
GYM_FILE_KEY = Variable.get('GYM_FILE_KEY')
AWS_ACCESS_KEY_ID = Variable.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = Variable.get('AWS_SECRET_ACCESS_KEY')
S3_BUCKET_NAME = Variable.get('S3_BUCKET_NAME')

# 데이터 가져오기 함수
def fetch_seoul_data(start_idx, end_idx):
    # 로깅 설정
    logger = logging.getLogger("airflow.task")
    url = f"{DATA_BASE_URL}/{DATA_API_KEY}/{OUTPUT_TYPE}/{SERVICE_NAME}/{start_idx}/{end_idx}/"
    response = requests.get(url)
    logger.info(response.text)
    if response.status_code == 200:
        return response.text  # XML 응답 반환
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

# XML 데이터를 CSV 문자열로 변환
def xml_to_filtered_csv_string(xml_data):
    try:
        # 로깅 설정
        logger = logging.getLogger("airflow.task")
        root = ET.fromstring(xml_data)
        filtered_rows = []

        # XML에서 필요한 데이터 추출
        for row in root.findall(".//row"):
            if row.find("TRDSTATENM") is not None and row.find("TRDSTATENM").text == "영업/정상":
                filtered_rows.append({
                    "name": row.find("BPLCNM").text if row.find("BPLCNM") is not None else "",
                    "location": row.find("RDNWHLADDR").text if row.find("RDNWHLADDR") is not None else "",
                    "phone_number": row.find("SITETEL").text if row.find("SITETEL") is not None else ""
                })
        logger.info(filtered_rows)
        # CSV로 변환하여 문자열로 리턴
        csv_buffer = StringIO()
        fieldnames = ["name", "location", "phone_number"]
        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(filtered_rows)

        return csv_buffer.getvalue()  # CSV 데이터를 문자열로 리턴
    except ET.ParseError as e:
        print(f"XML Parsing Error: {e}")
        return None
    except Exception as e:
        print(f"에러 발생: {e}")
        return None

# CSV 저장 함수
def save_to_s3(csv):

    # 로깅 설정
    logger = logging.getLogger("airflow.task")

    try:
        if not csv:
            logger.warning("No data available to save.")
            return

        # S3 클라이언트 생성
        s3_client = boto3.client(
            's3',
            region_name='ap-northeast-2',  # 필요한 경우 AWS 리전 변경
            aws_access_key_id=AWS_ACCESS_KEY_ID,  # 환경 변수로 관리하거나 Airflow Variables 사용
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY  # 환경 변수로 관리하거나 Airflow Variables 사용
        )

        # S3 업로드
        logger.info(csv)
        logger.info("Uploading updated CSV to S3...")
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=GYM_FILE_KEY,
            Body=csv,
            ContentType='text/csv'
        )
        logger.info("CSV 파일을 S3에 성공적으로 업데이트했습니다.")

    except Exception as e:
        logger.error(f"An error occurred while saving to S3: {e}", exc_info=True)

# DAG 기본 설정
default_args = {
    'owner ' : 'airflow',
    'retries' : 1, # 한번만 다시 하도록 설정
    'retry_delay' : timedelta(minutes = 5)
}

with DAG(
    dag_id='gym_meta_Dag',
    default_args=default_args,
    description='Fetch Seoul Gym data and sace to CSV',
    schedule_interval='@daily', # TASK : 지금은 하루에 한 번인데 얼마만에 한 번 가져올지 작성해야함
    start_date=datetime(2025,1,1),
    catchup=False # 일단 그 전에 기록을 가져오지 않도록
) as dag:

    # Task 1 : API 데이터 가져오기
    fetch_data = PythonOperator(
        task_id='fetch_data',
        python_callable=fetch_seoul_data,
        op_kwargs={'start_idx' : 1, 'end_idx' : 1000}
    )

    # Task 2 : 데이터 변환 (xml to json)
    transform_data = PythonOperator(
        task_id = 'transform_data',
        python_callable=xml_to_filtered_csv_string,
        op_kwargs={'xml_data': '{{ ti.xcom_pull(task_ids="fetch_data") }}'}
    )

    # Task 3 : CSV로 저장
    save_data = PythonOperator(
        task_id = 'save_data',
        python_callable=save_to_s3,
        op_kwargs={'csv': '{{ ti.xcom_pull(task_ids="transform_data") }}'}
    )

    # 의존성 설정
    fetch_data >> transform_data >> save_data