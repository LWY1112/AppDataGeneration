const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');
const fs = require('fs');
const path = require('path');

// API endpoints
const merchandisesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/merchandises/list/ADMIN';
const addMerchandiseApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/merchandises';

// Function to fetch merchandise items with category "shoes"
const fetchMerchandise = async () => {
    try {
      const response = await axios.post(merchandisesApiEndpoint, {
        query: { category: 'shoes' } // Apply the category filter
      });
  
      // Log the entire response to see its structure
      console.log('Full response from merchandise API:', JSON.stringify(response.data, null, 2));
  
      // Access the 'merchandises' array from the response
      const merchandises = response.data.merchandises || [];
      console.log(`Fetched merchandise count: ${merchandises.length}`);
      return merchandises;
      
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      return [];
    }
  };

// Function to add new merchandise item
const addMerchandise = async (merchandise) => {
  try {
    const response = await axios.post(addMerchandiseApiEndpoint, merchandise);
    return response.data;
  } catch (error) {
    console.error('Error adding merchandise:', error);
    return null;
  }
};

const duplicateMerchandise = async () => {
    try {
      const merchandises = await fetchMerchandise();
      console.log(`Total merchandise count: ${merchandises.length}`);
  
      const results = [];
  
      for (let i = 0; i < merchandises.length; i++) {
        const original = merchandises[i];
        console.log(`Original merchandise item: ${JSON.stringify(original, null, 2)}`);
  
        // Create a copy of the merchandise with modifications
        const duplicated = {
          ...original,
          _id: undefined, // New merchandise should not have an _id
          sku: `RENT-${faker.datatype.uuid()}`, // Generate a new SKU with prefix
          name: `RENT-${original.name}`, // Prefix name with "RENT-"
          stockable: false, // Always false
          rentable: true   // Always true
        };
  
        console.log(`Duplicating merchandise: ${original.name} to ${duplicated.name}`);
        const result = await addMerchandise(duplicated);
  
        if (result) {
          console.log(`Successfully added duplicated merchandise: ${duplicated.name}`);
          results.push(duplicated);
        }
      }
  
      // Save results to a JSON file
      const filePath = path.join(__dirname, 'database', 'rentalMerchandise.json');
      fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
      console.log(`Successfully saved ${results.length} duplicated merchandise items to ${filePath}`);
    } catch (error) {
      console.error('Error duplicating merchandise items:', error.message);
    }
  };

// Run the duplication process
duplicateMerchandise();
