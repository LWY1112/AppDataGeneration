const { faker } = require('@faker-js/faker/locale/en');
const fs = require('fs');
const path = require('path');

// Custom provider for Malaysian phone numbers
const malaysianLocale = {
  phone: {
    phoneNumber: () => {
      const areaCode = '1' + Math.floor(Math.random() * 10);
      const restOfNumber = Math.floor(Math.random() * 9000000) + 1000000;
      return {
        country_code: '60',  // Malaysia's country code
        number: `${areaCode}${restOfNumber}`
      };
    }
  },
};

// Predefined mapping of categories to potential descriptions
const categoryDescriptions = {
  "Books": "Discover a wide range of books from various genres and authors.",
  "Movies": "Explore the latest blockbusters, classic films, and everything in between.",
  "Music": "Find your favorite music albums and new releases across all genres.",
  "Games": "Shop for the latest video games, board games, and gaming accessories.",
  "Electronics": "Browse the newest electronics, gadgets, and accessories.",
  "Computers": "Find the best deals on laptops, desktops, and computer accessories.",
  "Home": "Discover home decor, furniture, and kitchen essentials.",
  "Garden": "Explore gardening tools, outdoor furniture, and plants.",
  "Tools": "Shop for power tools, hand tools, and tool accessories.",
  "Grocery": "Get fresh groceries, organic products, and pantry staples.",
  "Health": "Find health and wellness products, supplements, and personal care items.",
  "Beauty": "Explore beauty products, skincare, and makeup essentials.",
  "Clothing": "Discover the latest fashion trends and clothing essentials.",
  "Shoes": "Find your perfect pair of shoes from a wide selection of styles.",
  "Jewelry": "Shop for fine jewelry, watches, and accessories.",
  "Toys": "Find toys for all ages, from educational to fun and games.",
  "Baby": "Shop for baby essentials, clothing, and accessories.",
  "Automotive": "Browse car accessories, parts, and tools.",
  "Industrial": "Discover industrial supplies, equipment, and safety products.",
  "Sports": "Find sports equipment, apparel, and accessories.",
  "Outdoors": "Shop for outdoor gear, camping equipment, and adventure essentials.",
  "Office": "Explore office supplies, furniture, and equipment.",
  "Pet Supplies": "Find everything you need for your pets, from food to accessories."
};

// Global counter for sequence
let sequenceCounter = 1;

// Function to generate a random user account
function generateRandomUser() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.internet.userName();
  const roles = ['ADMIN', 'MANAGER', 'STAFF'];

  // Determine the number of roles (1 to the total number of available roles)
  const numberOfRoles = Math.floor(Math.random() * roles.length) + 1;
  
  // Select the roles
  const selectedRoles = [];
  while (selectedRoles.length < numberOfRoles) {
    const role = faker.helpers.arrayElement(roles);
    if (!selectedRoles.includes(role)) {
      selectedRoles.push(role);
    }
  }

  return {
    _id: username,
    email: faker.internet.email(),
    enable: faker.datatype.boolean(),
    name: `${firstName} ${lastName}`,
    note: faker.hacker.phrase(),
    password: faker.internet.password({ length: 10, pattern: /[a-zA-Z0-9_-]/ }),  // Alphanumeric password of length 10
    phone: malaysianLocale.phone.phoneNumber(),
    pin: faker.random.numeric(6),  // Numeric string of length 6
    role: selectedRoles
  };
}

// Function to generate a random employee account
function generateRandomEmployee() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const positions = ['Manager', 'Trainer', 'Full Timer', 'Part Timer'];

  return {
    _id: faker.internet.userName(),
    name: `${firstName} ${lastName}`,
    position: [faker.helpers.arrayElement(positions)],
    email: faker.internet.email(),
    phone: malaysianLocale.phone.phoneNumber(),
    note: faker.hacker.phrase(),
  };
}

// Function to generate a random products category
function generateRandomProduct() {
  const category = faker.commerce.department();
  const description = categoryDescriptions[category] || "Explore a variety of products in this category.";
  const sequence = sequenceCounter++;

  // Determine the number of images to generate (1 to 5)
  const numberOfImages = Math.floor(Math.random() * 5) + 1;
  const images = [];
  for (let i = 0; i < numberOfImages; i++) {
    const imageUrl = faker.image.urlLoremFlickr({ category, width: 640, height: 480 });
    images.push(imageUrl);
  }

  return {
    name: category,
    desc: description,
    images: images,
    sequence: sequence,
    enable: faker.datatype.boolean()
  };
}

// Function to generate and save accounts to a JSON file
async function generateAccounts(numAccounts, type) {
  const accounts = [];
  let generateFunction;
  let fileName;

  switch (type) {
    case 'user':
      generateFunction = generateRandomUser;
      fileName = 'generated_user_accounts.json';
      break;
    case 'employee':
      generateFunction = generateRandomEmployee;
      fileName = 'generated_employee_accounts.json';
      break;
    case 'product':
      generateFunction = generateRandomProduct;
      fileName = 'generated_product_category.json';
      break;
    default:
      console.error('Invalid account type specified.');
      process.exit(1);
  }

  for (let i = 0; i < numAccounts; i++) {
    const account = generateFunction();
    console.log(`Generated ${type} Account ${i + 1}:`, account);
    accounts.push(account);
  }

  const filePath = path.join(__dirname, 'database', fileName);
  fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
  console.log(`Saved ${numAccounts} ${type} accounts to ${filePath}`);
}

// Check if the number of accounts and type is provided as command-line arguments
const numAccounts = process.argv[2];
const accountType = process.argv[3];
if (!numAccounts || isNaN(numAccounts) || !accountType || !['user', 'employee', 'product'].includes(accountType)) {
  console.error('Please provide a valid number of accounts and account type (user/employee/product) as command-line arguments.');
  process.exit(1);
}

// Generate the specified number of accounts of the specified type
generateAccounts(Number(numAccounts), accountType);
