# Event-Task

# 목차

- [1. 실행 방법](#1-실행-방법)  
- [2. 설명 및 테스트](#2-설명-및-테스트)  
  - [a. 로그인 / 유저 등록](#a-로그인--유저-등록)  
    - [a-1. 로그인](#a-1-로그인)  
      - [a-1-1. Mac](#a-1-1-Mac)  
      - [a-1-2. Window](#a-1-2-Window)  
    - [a-2. 유저 등록](#a-2-유저-등록)  
      - [a-2-1. Mac](#a-2-1-Mac)  
      - [a-2-2. Window](#a-2-2-Window)  
  - [b. 이벤트 보기 / 등록](#b-이벤트-보기--등록)  
    - [b-1. 이벤트 전체 정보 조회](#b-1-이벤트-전체-정보-조회)  
      - [b-1-1. Mac](#b-1-1-Mac)  
      - [b-1-2. Window](#b-1-2-Window)  
    - [b-2. 특정 이벤트 1개 조회](#b-2-특정-이벤트-1개-조회)  
      - [b-2-1. Mac](#b-2-1-Mac)  
      - [b-2-2. Window](#b-2-2-Window)  
    - [b-3. 이벤트 등록](#b-3-이벤트-등록)  
      - [b-3-1. Mac](#b-3-1-Mac)  
      - [b-3-2. Window](#b-3-2-Window)  
  - [c. 보상 조회 / 등록](#c-보상-조회--등록)  
    - [c-1. 전체 보상 조회](#c-1-전체-보상-조회)  
      - [c-1-1. Mac](#c-1-1-Mac)  
      - [c-1-2. Window](#c-1-2-Window)  
    - [c-2. 특정 보상 조회](#c-2-특정-보상-조회)  
      - [c-2-1. Mac](#c-2-1-Mac)  
      - [c-2-2. Window](#c-2-2-Window)  
    - [c-3. 보상 등록](#c-3-보상-등록)  
      - [c-3-1. Mac](#c-3-1-Mac)  
      - [c-3-2. Window](#c-3-2-Window)  
  - [d. 보상 요청 조회 / 등록](#d-보상-요청-조회--등록)  
    - [d-1. 보상 요청 조회](#d-1-보상-요청-조회)  
      - [d-1-1. Mac](#d-1-1-Mac)  
      - [d-1-2. Window](#d-1-2-Window)  
    - [d-2. 특정 event에 대한 보상 요청 조회](#d-2-특정-event에-대한-보상-요청-조회)  
      - [d-2-1. Mac](#d-2-1-Mac)  
      - [d-2-2. Window](#d-2-2-Window)  
    - [d-3. 보상 요청 등록](#d-3-보상-요청-등록)  
      - [d-3-1. Mac](#d-3-1-Mac)  
      - [d-3-2. Window](#d-3-2-Window)  
- [3. 추가 설명](#3-추가-설명)  
  - [a. 이벤트 설계](#a-이벤트-설계)  
  - [b. 조건 검증 방식](#b-조건-검증-방식)  
- [4. 프로젝트 작성 중 겪은 고민](#4-프로젝트-작성-중-겪은-고민)  
  - [a. 토큰 만료 시간](#a-토큰-만료-시간)  
  - [b. 캐시 문제](#b-캐시-문제)  
  - [c. 보상 요청 등록](#c-보상-요청-등록)  

---

## 1. 실행 방법

```bash
docker compose up -d
```
- 터미널에서 위 명령어를 실행 시 docker-compose 컨테이너가 백그라운드에서 실행

## 2. 설명 및 테스트

- init-auth.js, init-event.js파일로 users, events, rewards, userEventLogs 컬렉션 생성 후 데이터 삽입
- 코드 정렬을 위해 \를 넣었으나 window 명령어에서는 지원하지 않아 코드를 두개로 분리


### a. 로그인 / 유저 등록

- **"<ACCESS_TOKEN>" 부분에 반환된 토큰 필수 입력**
  
#### a-1. 로그인

##### a-1-1. Mac
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "password":"password"
  }'
```
##### a-1-2. Window
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"password\":\"password\"}"
```
- 터미널에서 미리 삽입 해둔 데이터로 로그인 실행
- 요청시 토큰 반환 (백엔드 로직만 구현으로 토큰반환, role : ADMIN)

#### a-2. 유저 등록

##### a-2-1. Mac
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "newuser",
    "password": "123456",
    "role": "USER"
  }'
```

##### a-2-2. Window
```bash
curl -X POST http://localhost:3000/auth/register -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" -d "{\"name\": \"newuser\", \"password\": \"123456\", \"role\": \"USER\"}"
```

- 반환된 토큰으로 새로운 유저 등록
- 성공시 입력한 데이터 표출
- 권한이 없는 일반 유저 토큰으로 유저 삽입 시 권한이 없습니다. 메세지 표출

### b. 이벤트 보기 / 등록

- **"<ACCESS_TOKEN>" 부분에 반환된 토큰 필수 입력**
- **"\<eventId>" 부분에 반환된 _id값 필수 입력**

#### b-1. 이벤트 전체 정보 조회

##### b-1-1. Mac
```bash
curl -X GET "http://localhost:3000/events" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

##### b-1-2. Window
```bash
curl -X GET "http://localhost:3000/events" -H "Authorization: Bearer <ACCESS_TOKEN>"
```
- 이벤트에 대한 모든 정보 표출

#### b-2. 특정 이벤트 1개 조회

##### b-2-1. Mac
```bash
curl -X GET "http://localhost:3000/events/<eventId>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

##### b-2-2. Window
```bash
curl -X GET "http://localhost:3000/events/<eventId>" -H "Authorization: Bearer <ACCESS_TOKEN>"
```
- 특정 이벤트 1개 정보 표출

#### b-3. 이벤트 등록

##### b-3-1. Mac
```bash
curl -X POST http://localhost:3000/events \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
  -H "Content-Type: application/json" \
  -d '{
    "title": "Invite Friend2",
    "description": "Reward for inviting friends",
    "startDate": "2025-05-19T00:00:00.000Z",
    "endDate": "2025-06-18T23:59:59.999Z",
    "status": "ACTIVE",
    "condition": {
      "type": "FRIEND_INVITED_COUNT",
      "value": 1
    }
  }'
```

##### b-3-2. Window
```bash
curl -X POST http://localhost:3000/events -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" -d "{\"title\": \"Invite Friend2\", \"description\": \"Reward for inviting friends\", \"startDate\": \"2025-05-19T00:00:00.000Z\", \"endDate\": \"2025-06-18T23:59:59.999Z\", \"status\": \"ACTIVE\", \"condition\": {\"type\": \"FRIEND_INVITED_COUNT\", \"value\": 1}}"

```
- 이벤트 등록시 동일한 이벤트가 있을 시 "동일한 이벤트가 이미 존재합니다." 표출 (테스트코드에 2를 붙인 이유 : init-event.js으로 동일한 이벤트 등록)


### c. 보상 조회 / 등록

- **"<ACCESS_TOKEN>" 부분에 반환된 토큰 필수 입력**
- **"\<eventId>" 부분에 반환된 _id값 필수 입력**

#### c-1. 전체 보상 조회

##### c-1-1. Mac
```bash
curl -X GET "http://localhost:3000/events/rewards" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```
##### c-1-2. Window
```bash
curl -X GET "http://localhost:3000/events/rewards" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJzdWIiOiI2ODI4ODRiMmMyZjcyYjAxOWM2NWQwZmIiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NDc3MDU1NjQsImV4cCI6MTc0Nzc5MTk2NH0.YV8-HB9rtTBWaeMIviSH0i7ZvNsrDvVzUoe6k-Wm8HE"
```

#### c-2. 특정 보상 조회

##### c-2-1. Mac
```bash
curl -X GET "http://localhost:3000/events/rewards/?eventId=<eventId>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

##### c-2-2. Window
```bash
curl -X GET "http://localhost:3000/events/rewards/?eventId=<eventId>" -H "Authorization: Bearer <ACCESS_TOKEN>"
```


#### c-3. 보상 등록

##### c-3-1. Mac
```bash
curl -X POST http://localhost:3000/events/rewards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"\
  -d '{
    "eventId": "682884b2ae290524d865d0fc",
    "name": "Special Reward",
    "quantity": 10,
    "type": "POINT",
    "value": 100
  }'
```

##### c-3-2. Window
```bash
curl -X POST http://localhost:3000/events/rewards -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS_TOKEN>" -d "{\"eventId\": \"682884b2ae290524d865d0fc\", \"name\": \"Special Reward\", \"quantity\": 10, \"type\": \"POINT\", \"value\": 100}"
```
- 권한이 있는 OPERATOR, ADMIN만 등록 가능

### d. 보상 요청 조회 / 등록

- **"<ACCESS_TOKEN>" 부분에 반환된 토큰 필수 입력**
- **"\<eventId>" 부분에 반환된 _id값 필수 입력**

#### d-1. 보상 요청 조회

##### d-1-1. Mac
```bash
curl -X GET "http://localhost:3000/events/rewards/request" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

##### d-1-2. Window
```bash
curl -X GET "http://localhost:3000/events/rewards/request" -H "Authorization: Bearer <ACCESS_TOKEN>"
```
- role이 user로 설정된 계정은 본인의 기록만 조회, OPERATOR, AUDITOR, ADMIN은 전체 조회

#### d-2. 특정 event에 대한 보상 요청 조회

##### d-2-1. Mac
```bash
curl -X GET "http://localhost:3000/events/rewards/request?eventId=<eventId>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

##### d-2-2. Window
```bash
curl -X GET "http://localhost:3000/events/rewards/request?eventId=<eventId>" -H "Authorization: Bearer <ACCESS_TOKEN>"
```

#### d-3. 보상 요청 등록

##### d-3-1. Mac
```bash
curl -X POST http://localhost:3000/events/rewards/request \
  -H "Authorization: Bearer <ACCESS_TOKEN>"\
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "682884b2ae290524d865d0fc",
    "rewardId": "682950901e36fdd41244d341"
  }'
```

##### d-3-2. Window
```bash
curl -X POST http://localhost:3000/events/rewards/request -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-Type: application/json" -d "{\"eventId\": \"682884b2ae290524d865d0fc\", \"rewardId\": \"682950901e36fdd41244d341\"}"
```
- userEventLogs에 대한 default data
- 중복 보상 요청 시 "이미 보상 요청을 했습니다." 표출 및 상태 실패로 저장
- 이벤트 기간이 아닐 시 "이벤트 기간이 아닙니다." 표출 및 상태 실패로 저장
- 이벤트 활성 상태가 아닐 시 "이벤트가 활성 상태가 아닙니다." 표출 및 상태 실패로 저장
- 수량 부족 시 "수량 부족" 표출 및 저장 상태 실패로 저장


## 3. 추가 설명

### a. 이벤트 설계
- Auth-server, Event-server는 무조건 Gateway-server를 통해서만 접속이 가능하게 설계했습니다.
- 그 이유는 만약 Auth-server, Event-server가 포트번호 및 URL이 노출 되었을 경우 JWT 및 Role 인증 없이 바로 접근이 가능할 수도 있기 때문입니다.
- 또한 JWT토큰을 갈취하여 악용 할수도 있어 Gateway-server를 통해서만 접근이 가능하게 설계했습니다.
- Docker-Compose 설정에서 Expose을 사용하여 컨터이너의 특정 포트를 외부로 노출하지 않고 다른 컨테이너가 내부에서 접근 할수 있도록 설정했습니다.

### b. 조건 검증 방식
- 조건 검증 방식의 경우 Guard를 만들어 Controller에 접근 전 교차 검증을 통해 권한이 없거나 JWT토큰이 없을 경우 접속을 허용하지 않게 설계했습니다.


## 4. 프로젝트 작성 중 겪은 고민

### a. 토큰 만료 시간
- 서버 시간과 컴퓨터 시간이 다를 경우 토큰의 유효기간이 그냥 만료되어버리는 문제가 있었습니다.
- 제가 컴퓨터 시간과 서버 시간을 맞추더라도 다른 컴퓨터에서 만료가 되어버리면 실행조차 되지 않을거같아 만료시간을 24시간으로 늘림으로 문제를 해결했습니다.

### b. 캐시 문제
- 로컬에서 프로젝트 실행 시 캐시가 삭제되지 않고 남아 새롭게 변경한 부분이 반영되지 않은 문제가 있었습니다.
- 이전 캐시를 삭제하여 문제를 해결했습니다.

### c. 보상 요청 등록
- 보상 요청 등록 시 조건 별 등록 가능/실패가 되어야 하는데 로그 저장을 어떻게 해야할 지 고민을 했습니다.
-  미리 데이터 넣어서 보상 요청 가능하게 문제를 해결했습니다.


