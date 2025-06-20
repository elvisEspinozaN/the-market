const express = require("express");
const router = express.Router();
const { fetchProducts, fetchProductById } = require("../db/products");

// public routes

// get all products (limited data)
router.get("/", async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// get a single product by id
router.get("/:id", async (req, res, next) => {
  try {
    const product = await fetchProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
