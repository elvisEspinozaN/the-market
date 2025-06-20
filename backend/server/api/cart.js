const express = require("express");
const router = express.Router();
const { requireUser } = require("../middleware/auth");
const {
  getCart,
  addToCart,
  updateCartItem,
  checkoutCart,
  removeFromCart,
} = require("../db/cart");

// get current user's cart
router.get("/", requireUser, async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// add item to cart
router.post("/", requireUser, async (req, res, next) => {
  try {
    const cartItem = await addToCart(
      req.user.id,
      req.body.productId,
      req.body.quantity
    );
    res.json(cartItem);
  } catch (err) {
    next(err);
  }
});

// update quantity of a cart item
router.put("/:cartItemId", requireUser, async (req, res, next) => {
  try {
    const updateItem = await updateCartItem(
      req.params.cartItemId,
      req.body.quantity
    );
    res.json(updateItem);
  } catch (err) {
    next(err);
  }
});

// remove item from cart
router.delete("/:cartItemId", requireUser, async (req, res, next) => {
  try {
    await removeFromCart(req.params.cartItemId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// checkout and clear cart
router.post("/checkout", requireUser, async (req, res, next) => {
  try {
    await checkoutCart(req.user.id);
    res.json({ message: "Checkout successful" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
