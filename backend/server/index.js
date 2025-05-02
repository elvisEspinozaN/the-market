require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { client } = require("./db");

const app = express();
client.connect();

// middleware
app.use(express.json());
app.use(morgan("dev"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`- Server listening on port ${port}`));
