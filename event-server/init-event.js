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
    createdAt: new Date(),
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
    createdAt: new Date(),
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
    createdAt: new Date(),
  },
  {
    _id: ObjectId("682950901e36fdd41244d341"),
    eventId: ObjectId("682884b2ae290524d865d0fc"), // Invite Friend
    type: 'POINT',
    value: '100',
    quantity: 10,
    createdAt: new Date(),
  },
]);

// 유저 이벤트 로그 컬렉션 생성 및 데이터 삽입
eventDb.createCollection('userEventLogs');
eventDb.userEventLogs.insertMany([
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"),
    eventId: ObjectId("682884b2ae290524d865d0fb"),
    action: 'LOGIN',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"),
    eventId: ObjectId("682884b2ae290524d865d0fb"),
    action: 'LOGIN',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 1)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"),
    eventId: ObjectId("682884b2ae290524d865d0fb"),
    action: 'LOGIN',
    timestamp: new Date(),
    createdAt: new Date(),
  },
  {
    userId: ObjectId("682884b2c2f72b019c65d0fb"),
    eventId: ObjectId("682884b2ae290524d865d0fc"),
    action: 'INVITE_FRIEND',
    timestamp: new Date(),
    createdAt: new Date(),
  },
]);
