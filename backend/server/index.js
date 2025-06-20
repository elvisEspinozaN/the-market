require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { fetchAllProducts } = require("./db/admin");
const pool = require("./db/client");

const app = express();

// Setup CORS
const allowedOrigins =
  process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Health check route
app.get("/health", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.sendStatus(200);
});

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", async (req, res, next) => {
  try {
    const products = await fetchAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.use("/api/auth", require("./api/auth"));
app.use("/api/products", require("./api/products"));
app.use("/api/cart", require("./api/cart"));
app.use("/api/admin", require("./api/admin"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);

  if (err.message.includes("CORS")) {
    return res.status(403).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  pool
    .query("SELECT NOW()")
    .then((result) => console.log("Database connected at", result.rows[0].now))
    .catch((err) => {
      console.error("FATAL: Database connection failed", err);
      process.exit(1);
    });
});
