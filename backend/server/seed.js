require("dotenv").config();
const jwt = require("jsonwebtoken");
const { faker } = require("@faker-js/faker");

const {
  client,
  createTable,
  createUser,
  createProduct,
  makeAdmin,
  fetchUsers,
  fetchProducts,
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  checkoutCart,
} = require("./db");

async function seed() {
  await client.connect();

  await createTable();
  console.log("\n- Tables created");

  // creating admin
  const admin = await createUser({
    username: "admin",
    password: "test",
    name: "elvis esp",
    email_address: "elvis@test.com",
    phone: "1234567890",
    mailing_address: "test 123 st",
    billing_information: "stripe",
  });

  await makeAdmin(admin.id);
  console.log("\n- Admin created: ", admin);

  // seeding users
  await seedUsers();
  console.log("\n- Users seeded:");
  const users = await fetchUsers();
  console.log(users.slice(0, 3));

  // seeding products
  await seedProducts();
  console.log("\n- Products seeded:");
  const products = await fetchProducts();
  console.log(products.slice(0, 3));

  // test user/products
  const testUser = users[1];
  const testProduct1 = products[0];
  const testProduct2 = products[1];

  // adding to cart
  await addToCart(testUser.id, testProduct1.id, 1);
  await addToCart(testUser.id, testProduct2.id, 3);
  console.log("\n- Cart after adding items: ");
  let cart = await getCart(testUser.id);
  console.log(cart);

  // update cart quantity
  const cartItem1 = cart[0];
  await updateCartItem(cartItem1.cart_item_id, 5);
  console.log("\n- Cart after updating item 1: ");
  cart = await getCart(testUser.id);
  console.log(cart);

  // remove cart item
  await removeFromCart(cartItem1.cart_item_id);
  console.log("\n- Cart after deleting item 1: ");
  cart = await getCart(testUser.id);
  console.log(cart);

  // checkout
  await checkoutCart(testUser.id);
  console.log("\n- Checkout proccessed. \n- Cart after checkout: ");
  console.log(await getCart(testUser.id));

  await client.end();
}

seed();

async function seedUsers() {
  for (let i = 0; i < 10; i++) {
    await createUser({
      username: faker.internet.username(),
      password: "test",
      name: faker.person.fullName(),
      email_address: faker.internet.email(),
      phone: faker.string.numeric(10),
      mailing_address: faker.location.streetAddress(),
      billing_information: faker.finance.creditCardNumber(),
    });
  }
}

async function seedProducts() {
  for (let i = 0; i < 25; i++) {
    await createProduct({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price({ min: 1, max: 100 }),
      image_url: faker.image.url(),
      stock: Math.floor(Math.random() * 20) + 1,
    });
  }
}
