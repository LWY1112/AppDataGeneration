const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');

const categoryDescriptions = {
  'T-shirts': 'Discover a wide range of T-shirts for all occasions and styles.',
  'Accessories': 'Explore a variety of accessories to complement your look.',
  'Gears': 'Shop for gear and equipment for your hobbies and adventures.',
  'Shoes': 'Find your perfect pair of shoes from a wide selection of styles.',
  'Classes': 'Discover educational classes and workshops for personal growth.',
  'Fees': 'Explore fees and charges for various services and transactions.',
  'Sales': 'Find great deals and discounts on a variety of products.',
  'Food and Drinks': 'Discover delicious food and refreshing drinks for every palate.'
};

const generateCategoryFilePath = path.join(__dirname, 'database', 'generateCategory.json');

let sequenceCounter = 1;

function generateRandomProduct(category) {
  const description = categoryDescriptions[category];
  const sequence = sequenceCounter++;
  const types = ['MERCHANDISE', 'RENTAL'];

  // Determine the number of types (1 to the total number of available types)
  const numberOfTypes = Math.floor(Math.random() * types.length) + 1;

  // Select the types
  const selectedTypes = [];
  while (selectedTypes.length < numberOfTypes) {
    const type = faker.helpers.arrayElement(types);
    if (!selectedTypes.includes(type)) {
      selectedTypes.push(type);
    }
  }

  // Determine the number of images to generate (1 to 5)
  const numberOfImages = Math.floor(Math.random() * 5) + 1;
  const images = [];
  for (let i = 0; i < numberOfImages; i++) {
    const imageUrl = faker.image.imageUrl(640, 480, category);
    images.push(imageUrl);
  }

  // Generate _id based on category name
  const _id = category.toLowerCase().replace(/\s+/g, '-');

  const productData = {
    name: category,
    _id: _id, 
    desc: description,
    images: images,
    sequence: sequence,
    type: selectedTypes,
    enable: faker.datatype.boolean()
  };

  return productData;
}

// Function to save generated products to JSON file
function saveProductsToFile(products, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
  console.log(`Successfully saved generated products category to ${filePath}`);
}

// Function to post data using Axios
async function postData(url, data) {
  try {
    const response = await axios.post(url, data);
    console.log('Data posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting data:', error);
  }
}

// Function to generate and post products sequentially
async function generateAndPostProducts(categories) {
  const products = [];

  for (const category of categories) {
    const product = generateRandomProduct(category);
    products.push(product);

    // Post the product using Axios
    const apiUrl = 'https://batuu.sensoft.cloud:9889/v1/categories'; // Replace with your API endpoint
    await postData(apiUrl, product);
  }

  // Save all products to JSON file
  saveProductsToFile(products, generateCategoryFilePath);
}

// Extract categories from categoryDescriptions object
const categories = Object.keys(categoryDescriptions);

// Execute function to generate and post products sequentially
generateAndPostProducts(categories)
  .then(() => console.log('All products generated and posted successfully.'))
  .catch(err => console.error('Error generating or posting products:', err));
