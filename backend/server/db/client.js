require("dotenv").config();
const { Pool } = require("pg");

// init PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // fail quickly if connection can't be established
});

// hadnles unexpected errors
pool.on("error", (err) => {
  console.error("Unexpected databse error: ", err.message);
});

module.exports = pool;
