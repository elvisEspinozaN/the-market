require("dotenv").config();
const { faker } = require("@faker-js/faker");

const pool = require("./db/client");
const { createTable } = require("./db/schema");
const { createUser } = require("./db/users");
const { createProduct, fetchProducts } = require("./db/products");
const { makeAdmin, fetchUsers } = require("./db/admin");
const { addToCart, getCart } = require("./db/cart");

async function seed() {
  await createTable();
  console.log("\n- Tables created");

  // Create admin user
  const admin = await createUser({
    username: "admin",
    password: "test",
    name: "Admin User",
    email_address: "admin@example.com",
    phone: "5551234567",
    mailing_address: "123 Test Street, City",
    billing_information: "4111-1111-1111-1111",
  });
  await makeAdmin(admin.id);
  console.log("\n- Admin created: ", admin);

  // Seed realistic test users
  await seedRealisticUsers();
  console.log("\n- Users seeded:");
  const users = await fetchUsers();
  console.log(users.slice(0, 3));

  // Seed realistic products
  await seedRealisticProducts();
  console.log("\n- Products seeded:");
  const products = await fetchProducts();
  console.log(products.slice(0, 3));

  console.log(`\n- Total users: ${users.length}`);
  console.log(`- Total products: ${products.length}`);

  // Test cart functionality
  const testUser = users[1];
  console.log(
    `- Using user for cart test: ${testUser.username} (ID: ${testUser.id})`
  );
  const [product1, product2] = products;

  try {
    await addToCart(testUser.id, product1.id, 2);
    await addToCart(testUser.id, product2.id, 1);
    console.log("\n- Cart after adding items:");
    let cart = await getCart(testUser.id);
    console.log(cart);
  } catch (err) {
    console.error("Error adding items to cart:", err);
  }

  await pool.end();
}

// Realistic product data
const realisticProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Noise-cancelling over-ear headphones with 30-hour battery life",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    stock: 50,
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Insulated 24oz vacuum flask with leak-proof lid",
    price: 29.95,
    image_url: "https://images.unsplash.com/photo-1587393855524-087c83d31d5c",
    stock: 100,
  },
  {
    name: "Electric Stand Mixer",
    description:
      "6-quart capacity with 10-speed motor and stainless steel bowl",
    price: 349.99,
    image_url: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df",
    stock: 25,
  },
  {
    name: "Yoga Mat",
    description: "Eco-friendly 6mm thick non-slip exercise mat",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1576678927484-cc907957088c",
    stock: 75,
  },
  {
    name: "Smart LED TV",
    description: "55-inch 4K Ultra HD with HDR and streaming apps",
    price: 599.99,
    image_url: "https://images.unsplash.com/photo-1593784991095-a205069470b6",
    stock: 15,
  },
  {
    name: "Leather Wallet",
    description: "Genuine leather bifold wallet with RFID protection",
    price: 59.95,
    image_url: "https://images.unsplash.com/photo-1556740734-9f9ca0e0465b",
    stock: 200,
  },
  {
    name: "Bluetooth Speaker",
    description: "Waterproof portable speaker with 20-hour playtime",
    price: 129.99,
    image_url: "https://images.unsplash.com/photo-1588702547919-26089e690ecc",
    stock: 40,
  },
  {
    name: "Coffee Maker",
    description: "12-cup programmable drip coffee machine with thermal carafe",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1551030173-122aabc4489c",
    stock: 30,
  },
  {
    name: "Running Shoes",
    description: "Breathable mesh athletic shoes with cushioned midsole",
    price: 129.95,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    stock: 60,
  },
  {
    name: "Backpack",
    description: "Water-resistant 30L backpack with laptop compartment",
    price: 79.99,
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    stock: 45,
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic optical mouse with silent click technology",
    price: 39.99,
    image_url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
    stock: 150,
  },
  {
    name: "Ceramic Cookware Set",
    description: "10-piece non-stick ceramic-coated cookware set",
    price: 199.95,
    image_url: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18",
    stock: 20,
  },
  {
    name: "Electric Toothbrush",
    description: "Rechargeable with 3 cleaning modes and pressure sensor",
    price: 79.99,
    image_url: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b",
    stock: 80,
  },
  {
    name: "Laptop Sleeve",
    description: "Neoprene protective sleeve for 15-inch laptops",
    price: 29.99,
    image_url: "https://images.unsplash.com/photo-1588702547954-4806a4a92d1a",
    stock: 120,
  },
  {
    name: "Air Fryer",
    description: "5.8-quart digital air fryer with 7 cooking presets",
    price: 119.99,
    image_url: "https://images.unsplash.com/photo-1613514785940-daed07799d9b",
    stock: 35,
  },
  {
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor and GPS",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1558126319-c9feecbf57ee",
    stock: 25,
  },
  {
    name: "Desk Lamp",
    description: "LED adjustable task lamp with touch dimmer",
    price: 59.95,
    image_url: "https://images.unsplash.com/photo-1585637071663-799845ad5212",
    stock: 60,
  },
  {
    name: "Portable Charger",
    description: "20000mAh power bank with dual USB ports",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1587036676651-4fef7d0d6d2f",
    stock: 90,
  },
  {
    name: "Throw Blanket",
    description: "Soft fleece blanket 50x60 inches, machine washable",
    price: 39.95,
    image_url: "https://images.unsplash.com/photo-1578632749014-ca67efb0525b",
    stock: 110,
  },
  {
    name: "Gaming Keyboard",
    description: "Mechanical RGB keyboard with anti-ghosting keys",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1615663248957-5c418e4a7ee4",
    stock: 30,
  },
  {
    name: "Coffee Table Book",
    description: "Hardcover photography book - Modern Architecture",
    price: 49.99,
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    stock: 75,
  },
  {
    name: "Yoga Block Set",
    description: "2 high-density foam blocks for exercise and stretching",
    price: 24.99,
    image_url: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0",
    stock: 85,
  },
  {
    name: "Wireless Security Camera",
    description: "1080p HD with night vision and motion detection",
    price: 89.99,
    image_url: "https://images.unsplash.com/photo-1585366119957-e9730a464d3e",
    stock: 40,
  },
  {
    name: "Stainless Steel Cookware Set",
    description: "8-piece induction-compatible cookware set",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1589984662646-e7b2e4962f18",
    stock: 15,
  },
  {
    name: "Travel Pillow",
    description: "Memory foam neck pillow with removable cover",
    price: 34.95,
    image_url: "https://images.unsplash.com/photo-1589984700994-3df828735f59",
    stock: 65,
  },
  {
    name: "Blender",
    description: "1500-watt professional-grade blender with 64oz pitcher",
    price: 159.99,
    image_url: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5",
    stock: 20,
  },
  {
    name: "Wireless Earbuds",
    description: "True wireless earbuds with charging case (24hr battery)",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1590658006821-04f4008d5717",
    stock: 50,
  },
  {
    name: "Laptop Stand",
    description: "Adjustable aluminum ergonomic laptop riser",
    price: 39.99,
    image_url: "https://images.unsplash.com/photo-1593371253494-3c07b8b3cbb6",
    stock: 80,
  },
  {
    name: "Electric Kettle",
    description: "1.7L stainless steel with automatic shut-off",
    price: 49.95,
    image_url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
    stock: 45,
  },
  {
    name: "Resistance Bands Set",
    description: "5-piece latex-free exercise bands with handles",
    price: 29.99,
    image_url: "https://images.unsplash.com/photo-1576678927484-cc907957088c",
    stock: 95,
  },
  {
    name: "Desk Organizer",
    description: "Wooden desk tray with file compartments",
    price: 34.99,
    image_url: "https://images.unsplash.com/photo-1585637071663-799845ad5212",
    stock: 60,
  },
];

// Realistic user data
const realisticUsers = [
  {
    username: "john_doe",
    password: "test123",
    name: "John Doe",
    email_address: "john@example.com",
    phone: "5550101234",
    mailing_address: "456 Main Street, Anytown",
    billing_information: "5500-0000-0000-0004",
  },
  {
    username: "jane_smith",
    password: "test123",
    name: "Jane Smith",
    email_address: "jane@example.com",
    phone: "5550205678",
    mailing_address: "789 Oak Avenue, Somewhere",
    billing_information: "4111-1111-1111-1111",
  },
];

async function seedRealisticUsers() {
  // Create realistic test users
  for (const user of realisticUsers) {
    await createUser(user);
  }

  // Create additional fake users
  for (let i = 0; i < 8; i++) {
    await createUser({
      username: faker.internet.userName(),
      password: "test",
      name: faker.person.fullName(),
      email_address: faker.internet.email(),
      phone: faker.string.numeric(10),
      mailing_address: faker.location.streetAddress(),
      billing_information: faker.finance.creditCardNumber(),
    });
  }
}

async function seedRealisticProducts() {
  // Create realistic products
  for (const product of realisticProducts) {
    await createProduct(product);
  }
}

if (require.main === module) {
  seed().catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
}
