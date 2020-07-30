const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const knex = require("knex");
const { expect } = require("chai");
require("dotenv").config();

describe("User Endpoints", function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const newWorks = helpers.makeUserWorksArray();
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
  beforeEach("seed users", () => helpers.seedUsers(db, testUsers));
  beforeEach("seed works", () => helpers.seedWorks(db, newWorks));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("GET", () => {
    it("gets all works given a userid", () => {
      let id = testUser.userid;
      return supertest(app)
        .get(`/myworks?userid=${id}`)
        .expect(200)
        .then((res) => {
          expect(res.body[0].user_id).to.equal(id);
        });
    });
    describe("POST", () => {
      it("Posts a new work to table", () => {
        const newWork = {
          title: "mytesttitle",
          content: "hello world",
          wordcount: 2,
          user_id: 2,
        };
        return supertest(app)
          .post("/myworks")
          .send(newWork)
          .expect(201)
          .then((res) => {
            expect(res.body.work).to.have.key(
              "id",
              "content",
              "title",
              "user_id",
              "wordcount"
            );
          });
      });
    });
    describe("DELETE", () => {
      it("deletes a work given an id", () => {
        let id = "611eff82-1d2f-444c-9d12-db5d9608bff2";
        return supertest(app).delete(`/myworks/id/${id}`).expect(204);
      });
    });
  });
});
