const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("../middleware/auth");
const {
  fetchUsers,
  makeAdmin,
  deleteUser,
  fetchAllProducts,
} = require("../db/admin");
const { updateUserProfile } = require("../db/users");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../db/products");

// Admin-only User routes

// get all users
router.get("/users", requireUser, requireAdmin, async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// update profile by id
router.put("/users/:id", requireUser, requireAdmin, async (req, res, next) => {
  try {
    const updateUser = await updateUserProfile(req.params.id, req.body);
    res.json(updateUser);
  } catch (err) {
    next(err);
  }
});

// promote user to admin
router.post(
  "/users/:id/make-admin",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    try {
      const updateUser = await makeAdmin(req.params.id);
      res.json(updateUser);
    } catch (err) {
      next(err);
    }
  }
);

// delete user by id
router.delete(
  "/users/:id",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    try {
      await deleteUser(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

// Admin-only Product routes

// create a new product
router.post("/products", requireUser, requireAdmin, async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// update product by id
router.put(
  "/products/:id",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    try {
      const product = await updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

// delete product by id
router.delete(
  "/products/:id",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    try {
      await deleteProduct(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

// fetch all products (all data)
router.get(
  "/products/all",
  requireUser,
  requireAdmin,
  async (req, res, next) => {
    try {
      const products = await fetchAllProducts();
      res.json(products);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
