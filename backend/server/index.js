require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const {
  client,
  fetchProducts,
  fetchProductById,
  findUserByToken,
  createProduct,
  updateProduct,
  deleteProduct,
  createUser,
  authenticate,
  fetchUserById,
  updateUserProfile,
  fetchUsers,
  makeAdmin,
  deleteUser,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  checkoutCart,
  fetchAllProducts,
} = require("./db");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.get("/", async (req, res, next) => {
  try {
    const products = await fetchAllProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.get("/health", (req, res) => res.sendStatus(200));

client
  .connect()
  .then(() => console.log("Database connected"))
  .then(() => client.query("SELECT NOW()"))
  .then((res) => console.log("Database timestamp:", res.rows[0].now))
  .catch((err) => console.error("Database connection error", err));

// auth middleware
app.use(async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const user = await findUserByToken(token);
      if (!user?.id) {
        return res.status(401).json({
          error: "Invalid or expired token",
        });
      }

      req.user = user;
    }

    next();
  } catch (err) {
    next(err);
  }
});

function requiredUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function isAdmin(req, res, next) {
  if (!req.user?.is_admin) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`- Server listening on port ${port}`));

// product routes
app.get("/api/products", async (req, res, next) => {
  try {
    const products = await fetchProducts();
    res.json(products);
  } catch (err) {
    next(err);
  }
});

app.get("/api/products/:id", async (req, res, next) => {
  try {
    const product = await fetchProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ error: "Product not found" });
    }
  } catch (err) {
    next(err);
  }
});

// auth routes
app.post("/api/auth/register", async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
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

app.get("/api/auth/me", requiredUser, async (req, res, next) => {
  try {
    const user = await fetchUserById(req.user.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

app.put("/api/auth/me", requiredUser, async (req, res, next) => {
  try {
    const updatedUser = await updateUserProfile(req.user.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// cart routes
app.get("/api/cart", requiredUser, async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

app.post("/api/cart", requiredUser, async (req, res, next) => {
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

app.put("/api/cart/:cartItemId", requiredUser, async (req, res, next) => {
  try {
    const updatedItem = await updateCartItem(
      req.params.cartItemId,
      req.body.quantity
    );
    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/cart/:cartItemId", requiredUser, async (req, res, next) => {
  try {
    await removeFromCart(req.params.cartItemId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.post("/api/checkout", requiredUser, async (req, res, next) => {
  try {
    await checkoutCart(req.user.id);
    res.json({ message: "Checkout successful!" });
  } catch (err) {
    next(err);
  }
});

// admin product routes
app.post(
  "/api/admin/products",
  requiredUser,
  isAdmin,
  async (req, res, next) => {
    try {
      const product = await createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
);

app.put(
  "/api/admin/products/:id",
  requiredUser,
  isAdmin,
  async (req, res, next) => {
    try {
      const product = await updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  "/api/admin/products/:id",
  requiredUser,
  isAdmin,
  async (req, res, next) => {
    try {
      await deleteProduct(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/api/admin/products/all",
  requiredUser,
  isAdmin,
  async (req, res, next) => {
    try {
      const products = await fetchAllProducts();
      res.json(products);
    } catch (err) {
      next(err);
    }
  }
);

// admin auth routes
app.get("/api/admin/users", requiredUser, isAdmin, async (req, res, next) => {
  try {
    const users = await fetchUsers();

    res.json(users);
  } catch (err) {
    next(err);
  }
});

app.put(
  "/api/admin/users/:id",
  requiredUser,
  isAdmin,
  async (req, res, next) => {
    try {
      const updateUser = await updateUserProfile(req.params.id, req.body);
      res.json(updateUser);
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/api/admin/users/:id/make-admin",
  requiredUser,
  isAdmin,
  async (req, res, next) => {
    try {
      const updatedUser = await makeAdmin(req.params.id);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
);

app.delete(
  "/api/admin/users/:id",
  requiredUser,
  isAdmin,
  async (req, res, next) => {
    try {
      await deleteUser(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);
