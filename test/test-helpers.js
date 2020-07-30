const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../src/config");

require("dotenv").config();

function makeUsersArray() {
  let newDate1 = new Date();
  let last_login1 = new Date(2020, 7, 20);
  let newDate2 = new Date(2020, 7, 21);
  return [
    {
      userid: 1,
      user_name: "test-user-1",
      password: "Password1!",
      full_name: "carlos",
      nickname: "car",
      date_created: newDate1,
      streak: 12,
      last_login: last_login1,
    },
    {
      userid: 2,
      user_name: "test-user-2",
      password: "Password1!",
      full_name: "carol",
      nickname: "carol",
      date_created: newDate2,
      streak: 0,
      last_login: null,
    },
  ];
}

function makeUserWorksArray() {
  return [
    {
      id: "611eff82-1d2f-444c-9d12-db5d9608bff2",
      title: "test-title-1",
      content: "some content here",
      wordcount: 3,
      user_id: 1,
    },
    {
      id: "3b79ca86-e62f-4c6f-b39d-8c3a731481a0",
      title: "test-title-2",
      content: "test content please read here",
      wordcount: 5,
      user_id: 2,
    },
  ];
}

function makeTables() {
  const testUsers = makeUsersArray();
  const testWorks = makeUserWorksArray();

  return { testUsers, testWorks };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx.raw("TRUNCATE iterateusers, userworks RESTART IDENTITY CASCADE")
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.transaction(async (trx) => {
    await trx.into("iterateusers").insert(preppedUsers);
  });
}

function makeExpectedWork(work) {
  return {
    id: work.id,
    title: work.title,
    content: work.content,
    wordcount: work.wordcount,
    user_id: work.user_id,
  };
}

function seedWorks(db, works) {
  return db.transaction(async (trx) => {
    await trx.into("userworks").insert(works);
  });
}

function makeAuthHeader(user, secret = config.JWT_SECRET) {
  const token = jwt.sign({ user_name: user.userid }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeUserWorksArray,
  makeTables,
  cleanTables,
  seedUsers,
  makeExpectedWork,
  seedWorks,
  makeAuthHeader,
};
