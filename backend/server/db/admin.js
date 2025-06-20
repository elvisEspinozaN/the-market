const pool = require("./client");

// fetch all users relevant data
async function fetchUsers() {
  const { rows } = await pool.query(`
    SELECT id, username, name, is_admin, email_address, phone, mailing_address, billing_information FROM users
  `);
  return rows;
}

// grant admin privileges to user by id
async function makeAdmin(userId) {
  const {
    rows: [user],
  } = await pool.query(
    `
    UPDATE users
    SET is_admin = TRUE, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, username, is_admin
    `,
    [userId]
  );

  return user;
}

// delete a user by id
async function deleteUser(userId) {
  await pool.query(
    `
    DELETE FROM users WHERE id = $1
    `,
    [userId]
  );
}

// fetch all products (all data)
async function fetchAllProducts() {
  const { rows } = await pool.query(`SELECT * FROM products`);
  return rows;
}

// delete a product by id
async function deleteProduct(productId) {
  await pool.query(
    `
    DELETE FROM products WHERE id = $1
    `,
    [productId]
  );
}

module.exports = {
  fetchUsers,
  makeAdmin,
  deleteUser,
  fetchAllProducts,
  deleteProduct,
};
