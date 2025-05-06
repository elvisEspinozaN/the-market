require("dotenv").config();
const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

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
      mailing_address TEXT NOT NULL,
      billing_information TEXT NOT NULL,
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
      mailing_address TEXT NOT NULL,
      billing_information TEXT NOT NULL,
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

  return product;
}

// admin products methods
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

// user methods
async function createUser({
  username,
  password,
  name,
  email_address,
  phone,
  mailing_address,
  billing_information,
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

async function updateUserProfile(
  userId,
  { name, email_address, phone, mailing_address, billing_information }
) {
  const {
    rows: [user],
  } = await client.query(
    `
    UPDATE users
    SET name = $1, email_address = $2, phone = $3, mailing_address = $4, billing_information = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING id, username, name, email_address, phone, mailing_address, billing_information
    `,
    [name, email_address, phone, mailing_address, billing_information, userId]
  );

  return user;
}

// admin users methods
async function fetchUsers() {
  const { rows } = await client.query(
    `SELECT id, username, name, email_address, phone, mailing_address, billing_information FROM users`
  );

  return rows;
}

async function makeAdmin(userId) {
  const {
    rows: [user],
  } = await client.query(
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

async function deleteUser(userId) {
  await client.query(
    `
    DELETE FROM users WHERE id = $1
    `,
    [userId]
  );
}

// auth methods
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

// cart methods
async function getCart(userId) {
  const { rows } = await client.query(
    `
    SELECT cart_items.id AS cart_item_id, cart_items.quantity,
    products.id AS product_id, products.name, products.description, products.price, products.image_url, products.stock FROM cart_items
    JOIN products ON products.id = cart_items.product_id
    WHERE cart_items.user_id = $1
    `,
    [userId]
  );

  return rows;
}

async function addToCart(userId, productId, quantity) {
  const product = await fetchProductById(productId);
  if (!product || product.stock < quantity) {
    throw new Error("Low Stock or Not available");
  }
  const {
    rows: [item],
  } = await client.query(
    `
    INSERT INTO cart_items (id, user_id, product_id, quantity)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, product_id) DO UPDATE
    SET quantity = cart_items.quantity + $4, updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [uuid.v4(), userId, productId, quantity]
  );
  return item;
}

async function updateCartItem(cartItemId, quantity) {
  const {
    rows: [item],
  } = await client.query(
    `
    UPDATE cart_items
    SET quantity = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    [cartItemId, quantity]
  );

  return item;
}

async function removeFromCart(cartItemId) {
  await client.query(
    `
    DELETE FROM cart_items 
    WHERE id = $1
    RETURNING *
    `,
    [cartItemId]
  );
}

async function checkoutCart(userId) {
  await client.query(
    `
    DELETE FROM cart_items 
    WHERE id = $1
    `,
    [userId]
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
  createUser,
  fetchUserById,
  updateUserProfile,
  fetchUsers,
  makeAdmin,
  deleteUser,
  authenticate,
  findUserByToken,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkoutCart,
};
