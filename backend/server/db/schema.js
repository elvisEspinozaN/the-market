const { client } = require("./client");

async function createTable() {
  try {
    await client.query(`
    DROP TABLE IF EXISTS cart_items, orders, order_items, products, users CASCADE;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email_address TEXT UNIQUE NOT NULL,
      phone TEXT,
      mailing_address TEXT,
      billing_information TEXT,
      is_admin BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      stock INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      quantity INTEGER NOT NULL
    );

    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE NOT NULL,
      quantity INTEGER NOT NULL,
      price_at_purchase DECIMAL(10,2)
    );
`);

    console.log("- Schema reset and recreated.");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

module.exports = { createTable };
