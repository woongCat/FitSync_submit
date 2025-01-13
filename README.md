# FitSync

**FitSync**는 트레이너와 고객 간의 PT 기록, 운동 데이터, 인증 및 메타데이터를 통합 관리하는 플랫폼입니다. 이 프로젝트는 헬스장 및 트레이너가 고객과 원활하게 소통하고 데이터를 관리할 수 있도록 설계되었습니다.



## **프로젝트 개요**

FitSync는 다음과 같은 목적을 위해 개발되었습니다:

- 트레이너와 고객 간의 효과적인 소통 지원
- PT 기록 및 운동 데이터를 체계적으로 관리
- 인증 및 메타데이터를 통합 관리하여 운영 효율성을 개선



## **주요 기능**

1. **운동 메타데이터 제공**
   - 운동 이름, 목표 부위, 1차/2차 근육 정보, 운동 이미지 등 관리
2. **트레이너-고객 관계 관리**
   - 트레이너와 고객 간의 연결 및 PT 기록 관리
3. **PT 기록 저장 및 조회**
   - 세트, 반복 횟수, 무게 등의 데이터를 기반으로 기록 관리
4. **카메라 사용으로 PT 기록 생성 시 OCR로 자동 인식 기능 제공**
   - 운동 메타데이터 중 가장 유사한 항목으로 추천
5. **S3와 RDS 통합**
   - AWS S3를 활용한 파일 저장 및 AWS RDS를 이용한 데이터 관리
6. **자동화된 데이터 동기화**
   - Airflow를 활용한 주기적인 데이터 동기화 및 업데이트



## **사전 요구 사항**

- Python 3.10 이상
- PostgreSQL 13 이상
- AWS 계정 및 S3 버킷 생성
- Docker 및 Docker Compose



## **DB 및 DAG 기능**

1. **운동 데이터 동기화**

   - ExerciseDB 데이터를 API로 불러오고 S3 및 RDS에 동기화합니다.
   - link: [https://rapidapi.com/justin-WFnsXH\_t6/api/exercisedb](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb)

2. **트레이너-고객 연결**

   - 고객과 트레이너의 관계를 설정하고 PT 일정을 관리합니다.

3. **데이터 시각화**

   - 고객의 PT 기록 데이터를 관리합니다.

4. **GYM 데이터 동기화**

   - 서울시 GYM 데이터를 API로 불러오고 S3 및 RDS에 동기화합니다.
   - link: [https://data.seoul.go.kr/dataList/OA-16142/A/1/datasetView.do](https://data.seoul.go.kr/dataList/OA-16142/A/1/datasetView.do)


## **데이터베이스 구조**

- ​**Schema**: **`raw_data`**

  - `exercise`: 운동 메타데이터 테이블
  - `customer`: 고객 정보
  - `trainer`: 트레이너 정보
  - `pt_record`: PT 기록 테이블
  - `pt_record_exercise` : PT 기록 및 운동 데이터 연동 테이블
  - `pt_schedule` : PT 스케줄 테이블
  - `gym_metadata` : GYM 메타데이터 테이블

- ​**Schema**: **`credential`**

  - `user_auth`: 사용자 인증 정보


## **기술 스택**

<div style="display: flex; gap: 10px;">
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=plastic" />
  <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff&style=plastic" />
  <img alt="Flask" src="https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff&style=plastic" />
  <img alt="PythonAnywhere" src="https://img.shields.io/badge/PythonAnywhere-1D9FD7?logo=pythonanywhere&logoColor=fff&style=plastic" />
  <img alt="AWS" src="https://img.shields.io/badge/Amazon%20Web%20Services-232F3E?logo=amazonwebservices&logoColor=fff&style=plastic" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=plastic" />
  <img alt="Apache Airflow" src="https://img.shields.io/badge/Apache%20Airflow-017CEE?logo=apacheairflow&logoColor=fff&style=plastic" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff&style=plastic" />
</div>


## **문의**

- Email: [onedersea@gmail.com](mailto\:onedersea@gmail.com)






