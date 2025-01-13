import boto3
import csv
import ssl
import certifi
import http.client
import json
from io import StringIO
from airflow import DAG
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.models import Variable
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import logging

# 기본 설정
S3_BUCKET_NAME = Variable.get('S3_BUCKET_NAME')
S3_FILE_KEY = Variable.get('S3_FILE_KEY')
# 운동 데이터 가져오기
EXERCISE_API_KEY = Variable.get('EXERCISE_API_KEY')
# aws 키
AWS_ACCESS_KEY_ID = Variable.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = Variable.get('AWS_SECRET_ACCESS_KEY')

# API에서 gifURL 데이터만 가져오기
def fetch_and_update_gifurl():
    try:
        # 로깅 설정
        logger = logging.getLogger("airflow.task")

        # API 호출
        logger.info("Starting API call to fetch gifURL data...")
        conn = http.client.HTTPSConnection(
            "exercisedb.p.rapidapi.com",
            context=ssl.create_default_context(cafile=certifi.where())
        )
        headers = {
            'x-rapidapi-key': EXERCISE_API_KEY,
            'x-rapidapi-host': "exercisedb.p.rapidapi.com"
        }
        conn.request("GET", "/exercises?limit=0", headers=headers)
        res = conn.getresponse()
        data = res.read()
        json_data = json.loads(data.decode("utf-8"))
        logger.info(f"Fetched {len(json_data)} items from API.")

        # 기존 S3 데이터 가져오기
        logger.info("Fetching existing data from S3...")
        s3_client = boto3.client(
            's3',
            region_name='ap-northeast-2',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY
        )
        response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=S3_FILE_KEY)
        csv_content = response['Body'].read().decode('utf-8')
        existing_data = list(csv.DictReader(StringIO(csv_content)))
        logger.info(f"Loaded {len(existing_data)} rows from S3.")

        # 데이터 업데이트
        logger.info("Updating gifURL data...")
        updated_data = []
        for existing_row in existing_data:
            matching_item = next(
                (item for item in json_data if int(item.get("id", 0)) == int(existing_row.get("id", 0))),
                None
            )
            if matching_item:
                logger.debug(f"Updating gifUrl for ID {existing_row['id']}: {matching_item['gifUrl']}")
                existing_row["gifUrl"] = matching_item["gifUrl"]
            else:
                logger.debug(f"No matching item found for ID {existing_row['id']}")
            updated_data.append(existing_row)

        # CSV로 저장
        logger.info("Writing updated data to CSV buffer...")
        csv_buffer = StringIO()
        fieldnames = existing_data[0].keys()
        writer = csv.DictWriter(csv_buffer, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(updated_data)

        # CSV Buffer 출력
        csv_content_debug = csv_buffer.getvalue()
        logger.info("CSV Buffer Content Before Upload:")
        logger.info("\n" + csv_content_debug)

        # S3 업로드
        logger.info("Uploading updated CSV to S3...")
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=S3_FILE_KEY,
            Body=csv_content_debug
        )
        logger.info("CSV 파일을 S3에 성공적으로 업데이트했습니다.")

    except Exception as e:
        logger.error(f"에러 발생: {str(e)}", exc_info=True)

# RDS에서 gifURL 업데이트
def update_gifurl_in_rds():
    
    # S3에서 CSV 파일 읽기
    s3_client = boto3.client(
        's3',
        region_name='ap-northeast-2',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
    )
    response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=S3_FILE_KEY)
    csv_content = response['Body'].read().decode('utf-8')
    csv_reader = csv.DictReader(StringIO(csv_content))
    
    # RDS 연결
    conn_id = 'fitsync_postgres'
    postgres_hook = PostgresHook(postgres_conn_id=conn_id)
    connection = postgres_hook.get_conn()

    # gifURL 업데이트
    cursor = connection.cursor()

    for row in csv_reader:
        update_query = """
        UPDATE raw_data.exercise
        SET gifurl = %s
        WHERE exercise_id = %s
        """
        cursor.execute(update_query, (row['gifUrl'], row['id']))

    connection.commit()
    cursor.close()
    connection.close()
    print("RDS에서 gifURL 업데이트 완료.")

# DAG 정의
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='update_exercise_gifurl',
    default_args=default_args,
    description='Fetch and update gifURL from ExerciseDB API to S3 and RDS',
    schedule_interval='@daily',
    start_date=datetime(2024, 12, 1),
    catchup=False,
    tags=['exercise', 'gifurl', 'update'],
) as dag:

    # 작업 1: S3의 gifURL 업데이트
    fetch_gifurl_task = PythonOperator(
        task_id='fetch_and_update_gifurl',
        python_callable=fetch_and_update_gifurl,
    )

    # 작업 2: RDS의 gifURL 업데이트
    update_rds_task = PythonOperator(
        task_id='update_gifurl_in_rds',
        python_callable=update_gifurl_in_rds,
    )

    # 의존성 설정
    fetch_gifurl_task >> update_rds_task

