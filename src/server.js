require("dotenv").config();
const app = require("./app");
const { PORT, NODE_ENV } = require("./config");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
});

app.set("db", db);

app.listen(PORT, () => console.log(`Server running in ${NODE_ENV} on ${PORT}`));
