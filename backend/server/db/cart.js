const pool = require("./client");
const uuid = require("uuid");
const { fetchProductById } = require("./products");

// get all cart items for a specific user, w/ product details
async function getCart(userId) {
  const { rows } = await pool.query(
    `
    SELECT cart_items.id AS cart_item_id, cart_items.quantity,
    products.id AS product_id, products.name, products.description, products.price, products.image_url, products.stock 
    FROM cart_items
    JOIN products ON products.id = cart_items.product_id
    WHERE cart_items.user_id = $1
    `,
    [userId]
  );

  return rows;
}

// add an item to the cart
async function addToCart(userId, productId, quantity) {
  const product = await fetchProductById(productId);
  if (!product || product.stock < quantity) {
    throw new Error("Low Stock or Not available");
  }
  const {
    rows: [item],
  } = await pool.query(
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

// update quantity of specific cart item
async function updateCartItem(cartItemId, quantity) {
  const {
    rows: [item],
  } = await pool.query(
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

// remove specific item from cart
async function removeFromCart(cartItemId) {
  await pool.query(
    `
    DELETE FROM cart_items 
    WHERE id = $1
    RETURNING *
    `,
    [cartItemId]
  );
}

async function checkoutCart(userId) {
  await pool.query(
    `
    DELETE FROM cart_items 
    WHERE user_id = $1
    `,
    [userId]
  );
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkoutCart,
};
