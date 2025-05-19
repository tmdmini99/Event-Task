## Docker-Compose 실행

```bash
docker compose up -d
```
도커 실행 시 백그라운드 실행

---
## 서버 테스트

init.js파일로 users, events, rewards, userEventLogs 컬렉션 생성 후 데이터 삽입


### 로그인/ 유저 등록

터미널에서 미리 삽입 해둔 데이터로 로그인 실행

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","password":"password"}'
```
요청시 토큰 반환(백엔드 로직만 구현으로 토큰반환) (role : ADMIN)
반환 된 토큰으로 새로운 유저 등록
_"<ACEESS_TOKEN>" 부분에 반환 된 토큰을 꼭 입력해주세요._

```bash
curl -X POST http://localhost:3000/auth/register \

  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \

  -H "Content-Type: application/json" \

  -d '{

    "name": "newuser",

    "password": "123456",

    "role": "USER"

  }'
```
성공시 입력한 데이터 출력
권한이 없는 일반 유저 토큰으로 유저 삽입 시 권한이 없습니다. 메세지 출력

### 이벤트 보기/이벤트 등록

_"<ACEESS_TOKEN>" 부분에 반환 된 토큰을 꼭 입력해주세요._

이벤트 전체 정보 조회
```bash
curl -X GET "http://localhost:3000/events" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

특정 이벤트 1개 조회("<eventId>" 부분에 반환된 _id값을 입력해주세요.)
```bash
curl -X GET "http://localhost:3000/events/<eventId>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

이벤트 등록

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
이벤트 등록시 동일한 이벤트가 있을시에 "동일한 이벤트가 이미 존재합니다." 표출(테스트코드에 2를 붙인 이유 : init으로 이미 동일한 이벤트를 등록시켜놓았기 때문입니다.)


### 보상 조회 / 등록

_"<ACEESS_TOKEN>" 부분에 반환 된 토큰을 꼭 입력해주세요._

전체 보상 조회
```bash
curl -X GET "http://localhost:3000/events/rewards" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

특정 보상 조회("<eventId>" 부분에 반환된 _id값을 입력해주세요.)
```bash
curl -X GET "http://localhost:3000/events/rewards/?eventId=<eventId>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### 보상 요청 조회/ 등록

_"<ACEESS_TOKEN>" 부분에 반환 된 토큰을 꼭 입력해주세요._
보상 요청 조회(role : user인 계정은 본인의 기록만 조회 가능, OPERATOR,AUDITOR,ADMIN은 전체 조회 가능)
```bash
curl -X GET "http://localhost:3000/events/rewards/request" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

특정 event에 대한 보상 요청 조회("<eventId>" 부분에 반환된 _id값을 입력해주세요.)
```bash
curl -X GET "http://localhost:3000/events/rewards/request?eventId=<eventId>" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

보상 요청 등록(userEventLogs에 대한 데이터를 미리 1개 넣어두었습니다.)
```bash
curl -X POST http://localhost:3000/events/rewards/request \
  -H "Authorization: Bearer <ACCESS_TOKEN>"\
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "682884b2ae290524d865d0fc",
    "rewardId": "682950901e36fdd41244d341"
  }'
```
중복 보상 요청 시 "이미 보상 요청을 했습니다."출력 및 status : failed로 저장
이벤트 기간이 아닐 시 "이벤트 기간이 아닙니다." 표출 및 저장
이벤트 활성 상태가 아닐 시 "이벤트가 활성 상태가 아닙니다." 표출 및 저장
수량 부족 시 "수량 부족" 표출 및 저장

---

## 겪은 고민

### 토큰 만료 시간
- 서버 시간과 컴퓨터 시간이 다를 경우 토큰의 유효기간이 그냥 만료되어버리는 경우가 있었습니다.
- 제가 컴퓨터 시간과 서버 시간을 맞추더라도 다른 컴퓨터에서 만료가 되어버리면 실행조차 되지 않을거같아 만료시간을 24시간으로 늘림으로 문제를 해결했습니다.

### 캐시 문제
- 로컬에서 프로젝트 실행 시 캐시가 삭제되지 않고 남아 새롭게 변경한 부분이 반영되지 않은 문제가 있었습니다.
- 이전 캐시를 삭제하여 문제를 해결했습니다.

---

## 이벤트 설계 / 조건 검증 방식
- auth-server, event-server는 무조건 gateway-server를 통해서만 접속이 가능하게 설계했습니다. 그 이유는 만약 auth-server, event-server가 포트번호 및 url이 노출 되었을 경우 jwt 및 role 인증 없이 바로 접근이 가능할 수도 있기 때문입니다. 또한 jwt토큰을 갈취하여 악용 할수도 있어 gateway-server를 통해서만 접근이 가능하게 설계했습니다. 도커 컴포즈 설정에서 expose을 사용했습니다.
- 조건 검증 방식의 경우 Guard를 만들어 controller에 접근 전 교차 검증을 통해 권한이 없거나 jwt토큰이 없을 경우 접속을 허용하지 않게 설계했습니다.
