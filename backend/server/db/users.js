require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const pool = require("./client");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// create a new user
async function createUser({
  username,
  password,
  name,
  email_address,
  phone = null,
  mailing_address = null,
  billing_information = null,
}) {
  const hashed_password = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await pool.query(
    `
    INSERT INTO users (id, username, password, name, email_address, phone, mailing_address, billing_information)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, username, name, email_address, created_at
    `,
    [
      uuid.v4(),
      username,
      hashed_password,
      name,
      email_address,
      phone,
      mailing_address,
      billing_information,
    ]
  );

  return user;
}

// fetch public user info by id
async function fetchUserById(userId) {
  const {
    rows: [user],
  } = await pool.query(
    `
    SELECT id, name, username, email_address, mailing_address FROM users 
    WHERE id = $1
    `,
    [userId]
  );

  return user;
}

// update user profile info
async function updateUserProfile(userId, updates) {
  const {
    rows: [user],
  } = await pool.query(
    `UPDATE users
     SET name = $1, email_address = $2, phone = $3, 
         mailing_address = $4, billing_information = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING id, username, name, email_address, 
               phone, mailing_address, billing_information, is_admin`,
    [
      updates.name,
      updates.email_address,
      updates.phone,
      updates.mailing_address,
      updates.billing_information,
      userId,
    ]
  );
  return user;
}

// verify username/password
async function authenticate(username, password) {
  const {
    rows: [user],
  } = await pool.query(
    `
    SELECT * FROM users WHERE username = $1
    `,
    [username]
  );

  if (user && (await bcrypt.compare(password, user.password))) {
    delete user.password;
    return user;
  }

  return null;
}

// validate JWT and fetch user by token
async function findUserByToken(token) {
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const {
      rows: [user],
    } = await pool.query(
      `SELECT id, username, name, email_address, phone, mailing_address, billing_information, is_admin
       FROM users WHERE id = $1`,
      [id]
    );

    return user;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

module.exports = {
  createUser,
  fetchUserById,
  updateUserProfile,
  authenticate,
  findUserByToken,
};
