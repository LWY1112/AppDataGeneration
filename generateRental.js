const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');

const rentalsApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/rentals';
const merchandisesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/merchandises/list/ADMIN';
const generateRentalsJsonPath = path.join(__dirname, 'database', 'generateRentals.json');

// Function to fetch merchandises from API
const fetchMerchandises = async () => {
  try {
    const response = await axios.post(merchandisesApiEndpoint, {
      query: { rentable: true } // Filter to get only items where rentable is true
    });
    
    return response.data.merchandises.filter(merchandise => merchandise.category.includes('shoes'));
  } catch (error) {
    console.error('Error fetching merchandises:', error);
    return [];
  }
};

// Function to generate a random ID
const generateRandomId = () => {
  return faker.string.uuid();
};

// Function to generate a random rental item
const generateRandomRentalItem = (merchandise) => {
  const _id = generateRandomId();
  const size = faker.helpers.arrayElement(['UK7', 'UK8', 'UK9', 'UK10', 'US7', 'US8', 'US9', 'US10']);
  const desc = faker.datatype.boolean() ? faker.hacker.phrase() : '';

  return {
    _id: _id,
    name: merchandise.name,
    category: ['Shoes'],
    desc: desc,
    size: size,
    site: 'BATUU_3DAMANASARA',
    sku: merchandise.sku // Add the sku field as an array of strings
  };
};

// Function to generate and post rental items
const generateAndPostRentals = async (numItems) => {
  try {
    const merchandiseList = await fetchMerchandises();

    if (merchandiseList.length === 0) {
      console.error('No merchandise available for rental generation.');
      return;
    }

    const selectedMerchandises = faker.helpers.shuffle(merchandiseList).slice(0, numItems);
    const rentalItems = [];

    for (const merchandise of selectedMerchandises) {
      const rentalItem = generateRandomRentalItem(merchandise);
      rentalItems.push(rentalItem);

      try {
        const response = await axios.post(rentalsApiEndpoint, rentalItem);
        console.log(`Successfully posted rental item: ${JSON.stringify(response.data)}`);
      } catch (postError) {
        console.error(`Error posting rental item: ${JSON.stringify(rentalItem)}`, postError.message);
      }
    }

    // Save the rental items to a JSON file
    fs.writeFileSync(generateRentalsJsonPath, JSON.stringify(rentalItems, null, 2));
    console.log(`Successfully saved ${rentalItems.length} rental items to ${generateRentalsJsonPath}`);
  } catch (error) {
    console.error('Error generating and posting rental items:', error.message);
  }
};

// Check if the number of rental items is provided as a command-line argument
if (require.main === module) {
  const numItems = process.argv[2];
  if (!numItems || isNaN(numItems)) {
    console.error('Please provide a valid number of rental items as a command-line argument.');
    process.exit(1);
  }
  generateAndPostRentals(Number(numItems));
} else {
  module.exports = { generateAndPostRentals };
}
