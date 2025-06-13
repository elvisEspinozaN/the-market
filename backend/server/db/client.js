// DB Connection only - Node.js connects to PostgreSQL
require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.database_url,
  ssl: { rejectUnauthorized: false },
});

module.exports = client;
