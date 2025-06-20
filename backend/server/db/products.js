const pool = require("./client");
const uuid = require("uuid");

async function fetchProducts() {
  const { rows } = await pool.query(
    `SELECT id, name, description, price, image_url, stock FROM products`
  );

  return rows;
}

async function fetchProductById(productId) {
  const {
    rows: [product],
  } = await pool.query(
    `
    SELECT id, name, description, price, image_url, stock FROM products
    WHERE id = $1
    `,
    [productId]
  );

  return product;
}

async function createProduct({ name, description, price, image_url, stock }) {
  const {
    rows: [product],
  } = await pool.query(
    `
    INSERT INTO products (id, name, description, price, image_url, stock)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [uuid.v4(), name, description, price, image_url, stock]
  );

  return product;
}

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

async function deleteProduct(productId) {
  await pool.query(
    `
    DELETE FROM products WHERE id = $1
    `,
    [productId]
  );
}

module.exports = {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
