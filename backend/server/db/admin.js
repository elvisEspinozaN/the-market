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

// create a new product (same as old code)
async function createProduct({ name, description, price, image_url, stock }) {
  const {
    rows: [product],
  } = await pool.query(
    `
    INSERT INTO products (id, name, description, price, image_url, stock)
    VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5)
    RETURNING *
    `,
    [name, description, price, image_url, stock]
  );

  return product;
}

// update an existing product (same as old code)
async function updateProduct(
  productId,
  { name, description, price, image_url, stock, is_active }
) {
  const {
    rows: [product],
  } = await pool.query(
    `
    UPDATE products
    SET name = $1, description = $2, price = $3, image_url = $4, stock = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
    `,
    [name, description, price, image_url, stock, is_active, productId]
  );

  return product;
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
  createProduct,
  updateProduct,
  deleteProduct,
};
