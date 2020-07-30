const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const knex = require("knex");
const { expect } = require("chai");
require("dotenv").config();

describe("User Endpoints", function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("POST /check", () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));
    describe("Given a valid user", () => {
      it("it returns a message about the user's streak", () => {
        const user = {
          userid: testUser.userid,
        };
        return supertest(app)
          .post("/streak/check")
          .send(user)
          .expect(201)
          .then((res) => {
            expect(res.body).to.have.property("lastLogin");
            expect(res.body).to.have.property("message");
            return;
          });
      });
    });
  });
});
