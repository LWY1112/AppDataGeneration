const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');

// Path to the RockDB.json and generateMerchandise.json files
const rockDBPath = path.join(__dirname, 'database', 'RockDB.merchandises.json');
const generateMerchandisePath = path.join(__dirname, 'database', 'generateMerchandise.json');

// API endpoints
const apiUrl = 'https://batuu.sensoft.cloud:9889/v1/merchandises'; // Replace with your actual API endpoint
const discountApiUrl = 'https://batuu.sensoft.cloud:9889/v1/customers/tier'; // Discount API endpoint

let sequenceCounter = 1;

// Function to fetch discount values
async function fetchDiscountValues() {
  try {
    const response = await axios.get(discountApiUrl);
    const discountValues = response.data || [];
    console.log('Fetched discount values:', discountValues);
    return discountValues;
  } catch (error) {
    console.error('Error fetching discount values:', error.message);
    return [];
  }
}

// Function to transform and extract the required fields from the merchandise data
async function transformMerchandiseData(merchandise) {
  const roles = ['ADMIN', 'MANAGER', 'STAFF'];
  const stores = ['BATUU_3DAMANASARA', 'ONLINE'];
  const discounts = await fetchDiscountValues();

  // Determine the number of roles and stores
  const numberOfRoles = Math.floor(Math.random() * roles.length) + 1;
  const numberOfStores = Math.floor(Math.random() * stores.length) + 1;

  // Select the roles
  const selectedRoles = [];
  while (selectedRoles.length < numberOfRoles) {
    const role = faker.helpers.arrayElement(roles);
    if (!selectedRoles.includes(role)) {
      selectedRoles.push(role);
    }
  }

  // Select the stores
  const selectedStores = [];
  while (selectedStores.length < numberOfStores) {
    const store = faker.helpers.arrayElement(stores);
    if (!selectedStores.includes(store)) {
      selectedStores.push(store);
    }
  }

  // Generate random enable and stockable status
  const enable = faker.datatype.boolean();
  const sequence = sequenceCounter++;

  // Ensure each category in the array is a string and handle lowercase and space replacement
  let category = [];
  if (Array.isArray(merchandise.category)) {
    category = merchandise.category.map(cat =>
      typeof cat === 'string' ? cat.toLowerCase().replace(/\s+/g, '-') : ''
    ).filter(Boolean); // Remove empty strings
  }

  // Select a random discount
  const discount = discounts.length > 0 ? [faker.helpers.arrayElement(discounts)] : [];

  return {
    name: merchandise.name,
    sku: merchandise._id,
    parent_sku: merchandise.parent_sku,
    category: category,
    desc: merchandise.desc,
    images: merchandise.img,
    size: merchandise.size,
    unit_price: [{
      currency: merchandise.unit_price.currency,
      value: merchandise.unit_price.value,
      quantity: merchandise.unit_price.quantity,
      unit: merchandise.unit_price.unit
    }],
    // Add generated info
    authority: selectedRoles,
    site: selectedStores,
    enable: enable,
    sequence: sequence,
    discount: discount
  };
}

// Function to post data using Axios
async function postData(url, data) {
  try {
    const response = await axios.post(url, data);
    console.log('Data posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting data:', error.response ? error.response.data : error.message);
  }
}

// Asynchronous function to transform, save, and post merchandise data
async function transformSaveAndPostMerchandise() {
  try {
    // Read the RockDB.merchandises.json file
    const rockDBData = JSON.parse(fs.readFileSync(rockDBPath, 'utf-8'));

    // Transform the data
    const transformedData = await Promise.all(rockDBData.map(transformMerchandiseData));

    // Write the updated data to the generateMerchandise.json file (overwrite existing file)
    fs.writeFileSync(generateMerchandisePath, JSON.stringify(transformedData, null, 2));
    console.log(`Successfully saved transformed merchandise data to ${generateMerchandisePath}`);

    // Post each merchandise item to the API endpoint one by one
    for (const merchandise of transformedData) {
      await postData(apiUrl, merchandise);
    }

    console.log('All merchandise items posted successfully.');
  } catch (error) {
    console.error('Error transforming, saving, or posting merchandise data:', error.message);
  }
}

// Execute the main function
transformSaveAndPostMerchandise();
