const app = require("../src/app");
const supertest = require("supertest");

describe("App", () => {
  it("should return 200", () => {
    return supertest(app).get("/").expect(200);
  });
});
