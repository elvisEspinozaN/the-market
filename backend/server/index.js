require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { authenticateUser } = require("./middleware/auth");
const { fetchAllProducts } = require("./db/admin");
const pool = require("./db/client");

const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(authenticateUser);

const port = process.env.PORT || 3000;

// root/health route
app.get("/", async (req, res, next) => {
  try {
    const products = await fetchAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.get("/health", (req, res) => res.sendStatus(200));

// modularized routes
app.use("/api/auth", require("./api/auth"));
app.use("/api/products", require("./api/products"));
app.use("/api/cart", require("./api/cart"));
app.use("/api/admin", require("./api/admin"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  pool
    .query("SELECT NOW()")
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("DB connection error", err));
});
