// init-auth.js

const authDb = db.getSiblingDB('auth-db');

authDb.createCollection('users');
authDb.users.insertMany([
  {
    _id: ObjectId("682884b2c2f72b019c65d0fb"), // John Doe
    name: 'John Doe',
    password: '$2b$10$BCVcFr1d6UaI1PGCpPNcnu2NNtUySU9pjlPpJ95bbXocEnfU/oeI2',
    role: 'ADMIN',
    createdAt: new Date(),
  },
  {
    _id: ObjectId("682884b2c2f72b019c65d0fc"), // Jane Doe
    name: 'Jane Doe',
    password: '$2b$10$BCVcFr1d6UaI1PGCpPNcnu2NNtUySU9pjlPpJ95bbXocEnfU/oeI2',
    role: 'USER',
    createdAt: new Date(),
  },
]);
