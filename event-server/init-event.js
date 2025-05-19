// init-event.js

const eventDb = db.getSiblingDB('event-db');

// 이벤트 컬렉션 생성 및 데이터 삽입
eventDb.createCollection('events');
const eventInsertResult = eventDb.events.insertMany([
  {
    _id: ObjectId("682884b2ae290524d865d0fb"), // Login 3 Days
    title: 'Login 3 Days',
    description: 'Reward for logging in 3 consecutive days.',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: 'ACTIVE',
    condition: {
      type: 'LOGIN_DAY_COUNT',
      value: 3,
    },
  },
  {
    _id: ObjectId("682884b2ae290524d865d0fc"), // Invite Friend
    title: 'Invite Friend',
    description: 'Reward for inviting a friend to join.',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: 'ACTIVE',
    condition: {
      type: 'FRIEND_INVITED_COUNT',
      value: 1,
    },
  },
]);

// 리워드 컬렉션 생성 및 데이터 삽입
eventDb.createCollection('rewards');
eventDb.rewards.insertMany([
  {
    _id: ObjectId("6828aa8d20ce84f632b8da7a"),
    eventId: ObjectId("682884b2ae290524d865d0fb"), // Login 3 Days
    type: 'POINT',
    value: '100',
    quantity: 9,
  },
  {
    _id: ObjectId("682950901e36fdd41244d341"),
    eventId: ObjectId("682884b2ae290524d865d0fc"), // Invite Friend
    type: 'POINT',
    value: '100',
    quantity: 10,
  },
]);

// 유저 이벤트 로그 컬렉션 생성 및 데이터 삽입
eventDb.createCollection('userEventLogs');
eventDb.userEventLogs.insertMany([
  // 로그인 3일 기록 (Login 3 Days)
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"), // John Doe
    eventId: ObjectId("682884b2ae290524d865d0fb"),
    action: 'LOGIN',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"),
    eventId: ObjectId("682884b2ae290524d865d0fb"),
    action: 'LOGIN',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"),
    eventId: ObjectId("682884b2ae290524d865d0fb"),
    action: 'LOGIN',
    timestamp: new Date(),
  },
  // 친구 초대 기록 (Invite Friend)
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"),
    eventId: ObjectId("682884b2ae290524d865d0fc"),
    action: 'INVITE_FRIEND',
    timestamp: new Date(),
  },
]);
