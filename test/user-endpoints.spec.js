const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const knex = require("knex");
const { TEST_DATABASE_URL } = require("../src/config");
require("dotenv").config();

describe("User Endpoints", function () {
  let db;

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

  describe("POST /signup", () => {
    describe("Given a valid user", () => {
      it("stores the new user in db", () => {
        const newUser = {
          user_name: "Noaweuajnjdkl1234",
          password: "Password1!",
          full_name: "test name",
          nickname: "nick name",
        };
        return supertest(app).post("/signup").send(newUser).expect(201);
      });
    });
  });
});
