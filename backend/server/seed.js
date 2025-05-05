require("dotenv").config();
const jwt = require("jsonwebtoken");

const { client, createTable } = require("./db");

async function seed() {
  await client.connect();

  await createTable();
  console.log("\n- Tables created");

  await client.end();
}

seed();
