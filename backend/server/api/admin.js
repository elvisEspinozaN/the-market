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

// users
router.get("/users", requireUser, requireAdmin, async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.put("/users/:id", requireUser, requireAdmin, async (req, res, next) => {
  try {
    const updateUser = await updateUserProfile(req.params.id, req.body);
    res.json(updateUser);
  } catch (err) {
    next(err);
  }
});

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

// products
router.post("/products", requireUser, requireAdmin, async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

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
