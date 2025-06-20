require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const { Pool } = require("pg");

// init PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// handles unexpected errors
pool.on("error", (err) => {
  console.error("Unexpected databse error: ", err.message);
});

module.exports = pool;
