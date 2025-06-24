const { findUserByToken } = require("../db/users");

// authenticate user via bearer token
async function authenticateUser(req, res, next) {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const user = await findUserByToken(token);

      if (!user?.id) {
        return res.sendStatus(401);
      }
      req.user = user;
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    next(err);
  }
}

// valdate user iinput upon registration
function validateUser(req, res, next) {
  const { username, password, email_address } = req.body;

  if (!username || typeof username !== "string") {
    return res
      .status(400)
      .json({ error: "Username is required and must be a string" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email_address || !emailRegex.test(email_address)) {
    return res.status(400).json({ error: "A valid email address is required" });
  }

  next();
}

// enforce authentication
function requireUser(req, res, next) {
  if (!req.user) {
    return res.sendStatus(401);
  }
  next();
}

// enforce admin-only access
function requireAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res.sendStatus(403);
  }

  next();
}

module.exports = {
  authenticateUser,
  requireUser,
  requireAdmin,
  validateUser,
};
