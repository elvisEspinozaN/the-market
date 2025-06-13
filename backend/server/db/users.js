require("dotenv").config();
const client = require("./client");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

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
  } = await client.query(
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

async function fetchUserById(userId) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT id, name, username, email_address, mailing_address FROM users 
    WHERE id = $1
    `,
    [userId]
  );

  return user;
}

async function updateUserProfile(userId, updates) {
  const {
    rows: [user],
  } = await client.query(
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

async function authenticate(username, password) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT * FROM users WHERE username = $1
    `,
    [username]
  );

  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }

  return null;
}

async function findUserByToken(token) {
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username, name, email_address, phone, mailing_address, billing_information, is_admin FROM users
      WHERE id = $1
      `,
      [id]
    );
    return user;
  } catch (error) {
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
