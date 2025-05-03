require("dotenv").config();
const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(process.env.DATABASE_URL);

async function createTable() {
  await client.query(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(49) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      name VARCHAR(255) NOT NULL,
      email_address VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20) NOT NULL,
      shipping_address TEXT NOT NULL,
      mailing_address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL CHECK(price > 0),
      image_url TEXT,
      stock INTEGER DEFAULT 0 CHECK(stock >= 0),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE cart_items(
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, product_id)
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      total_price DECIMAL (10, 2) NOT NULL CHECK(total_price > 0),
      status VARCHAR(20) DEFAULT 'created',
      shipping_address TEXT NOT NULL,
      mailing_address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    
    CREATE TABLE order_items(
      id UUID PRIMARY KEY,
      order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id UUID REFERENCES products(id) ON DELETE SET NULL,
      product_name VARCHAR(255) NOT NULL,
      price_at_purchase DECIMAL(10, 2) NOT NULL CHECK(price_at_purchase > 0),
      quantity INTEGER NOT NULL CHECK(quantity > 0),
      created_at TIMESTAMP DEFAULT NOW()
    );
    `);
}

// product methods
async function fetchProducts() {
  const { rows } = await client.query(
    `SELECT id, name, description, price, image_url, stock FROM products`
  );

  return rows;
}

async function fetchProductById(productId) {
  const {
    rows: [product],
  } = await client.query(
    `
    SELECT id, name, description, price, image_url, stock FROM products
    WHERE id = $1
    `,
    [productId]
  );
}

// admin prodducts methods
async function createProduct({ name, description, price, image_url, stock }) {
  const {
    rows: [product],
  } = await client.query(
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
  } = await client.query(
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
  await client.query(
    `
    DELETE FROM products WHERE id = $1
    `,
    [productId]
  );
}

module.exports = {
  client,
  createTable,
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
