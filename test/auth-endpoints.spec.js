const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const { TEST_DATABASE_URL } = require("../src/config");

require("dotenv").config();

describe("Auth endpoints", function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("POST /login", () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    const requiredFields = ["username", "password"];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, async () => {
        delete loginAttemptBody.user_name;

        return await supertest(app)
          .post("/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing 'user_name' in request body`,
          });
      });

      it("responds 400 'invalid username or password' when bad username", async () => {
        const userInvalidUser = { user_name: "user-not", password: "existy" };
        return await supertest(app)
          .post("/login")
          .send(userInvalidUser)
          .expect(400, { error: "Incorrect username or password" });
      });

      it("responds 400 'invalid username or password' when bad password", async () => {
        const userInvalidPass = {
          user_name: testUser.user_name,
          password: "incorrect",
        };
        return await supertest(app)
          .post("/login")
          .send(userInvalidPass)
          .expect(400, { error: "Incorrect username or password" });
      });

      it("responds 200 and JWT auth token using secret when valid credentials", async () => {
        const userValidCreds = {
          user_name: testUser.user_name,
          password: testUser.password,
        };
        return await supertest(app)
          .post("/login")
          .send(userValidCreds)
          .expect(200);
      });
    });
  });
});
