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

// Function to generate a random ID limited to 20 characters
const generateRandomId = () => {
  return faker.string.uuid().slice(0, 20);
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
const generateAndPostRentals = async () => {
  try {
    const merchandiseList = await fetchMerchandises();

    if (merchandiseList.length === 0) {
      console.error('No rentable merchandise available for rental generation.');
      return;
    }

    const rentalItems = [];

    for (const merchandise of merchandiseList) {
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

// Run the function directly
if (require.main === module) {
  generateAndPostRentals();
} else {
  module.exports = { generateAndPostRentals };
}
