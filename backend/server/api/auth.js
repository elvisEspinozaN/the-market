require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { requireUser, validateUser } = require("../middleware/auth");
const {
  createUser,
  authenticate,
  fetchUserById,
  updateUserProfile,
} = require("../db/users");

router.post("/register", validateUser, async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await authenticate(req.body.username, req.body.password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireUser, async (req, res, next) => {
  try {
    const user = await fetchUserById(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put("/me", requireUser, async (req, res, next) => {
  try {
    const updateUser = await updateUserProfile(req.user.id, req.body);
    res.json(updateUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
