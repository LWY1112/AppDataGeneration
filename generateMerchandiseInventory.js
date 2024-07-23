const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');
const XLSX = require('xlsx');
const { format } = require('date-fns');

// API endpoints
const merchandisesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/merchandises/list/ADMIN';
const sitesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/sites/list/POS';
const inventorySaveApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/inventories/save';
const generateInventoryJsonPath = path.join(__dirname, 'database', 'generateMerchandiseInventory.json');
const generateInventoryExcelPath = path.join(__dirname, 'database', 'generateMerchandiseInventory.xlsx');

// Function to fetch merchandises from API
async function fetchMerchandises() {
  try {
    const response = await axios.post(merchandisesApiEndpoint);
    return response.data.merchandises;
  } catch (error) {
    console.error('Error fetching merchandises:', error);
    return [];
  }
}

// Function to fetch sites from API
async function fetchSites() {
  try {
    const response = await axios.post(sitesApiEndpoint);
    return response.data.sites;
  } catch (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
}

// Function to generate a random inventory item
function generateRandomInventoryItem(merchandise, sites) {
  const quantity = faker.number.int({ min: 1, max: 100 });
  const remark = faker.datatype.boolean() ? faker.hacker.phrase() : '';
  const date = format(faker.date.between({ from: '2023-01-01', to: '2024-12-31' }), 'dd/MM/yyyy');

  return {
    product_id: merchandise._id,
    sku: merchandise.sku,
    site: 'BATUU_3DAMANASARA',
    quantity: quantity,
    remark: remark,
    date: date,
  };
}

// Function to generate and save merchandise inventory
async function generateMerchandiseInventory(numItems) {
  try {
    const merchandiseList = await fetchMerchandises();
    const sitesList = await fetchSites();

    // Select random merchandises for generating inventory items
    const selectedMerchandises = faker.helpers.shuffle(merchandiseList).slice(0, numItems);

    // Generate inventory items
    const inventoryItems = selectedMerchandises.map(merchandise => generateRandomInventoryItem(merchandise, sitesList));

    // Save the generated inventory to a JSON file
    fs.writeFileSync(generateInventoryJsonPath, JSON.stringify(inventoryItems, null, 2));
    console.log(`Successfully saved ${numItems} inventory items to ${generateInventoryJsonPath}`);

    // Simplify inventory items for Excel file
    const excelInventoryItems = inventoryItems.map(({ site, sku, quantity, remark, date }) => ({
      site,
      sku,
      quantity,
      remark,
      date: new Date(date.split('/').reverse().join('-')) // Convert date string to Date object
    }));

    // Save the simplified inventory to an Excel file
    const worksheet = XLSX.utils.json_to_sheet(excelInventoryItems, { dateNF: 'dd/mm/yyyy' });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

    XLSX.writeFile(workbook, generateInventoryExcelPath);
    console.log(`Successfully saved ${numItems} inventory items to ${generateInventoryExcelPath}`);

    // Post inventory items to the API one by one
    for (const inventoryItem of inventoryItems) {
      const { date, ...itemToPost } = inventoryItem; // Exclude the date field
      try {
        const response = await axios.post(inventorySaveApiEndpoint, itemToPost);
        console.log(`Successfully posted inventory item: ${JSON.stringify(response.data)}`);
      } catch (postError) {
        console.error(`Error posting inventory item: ${JSON.stringify(itemToPost)}`, postError.message);
      }
    }
  } catch (error) {
    console.error('Error generating merchandise inventory:', error.message);
  }
}

// Check if the number of inventory items is provided as a command-line argument
if (require.main === module) {
  const numItems = process.argv[2];
  if (!numItems || isNaN(numItems)) {
    console.error('Please provide a valid number of inventory items as a command-line argument.');
    process.exit(1);
  }
  generateMerchandiseInventory(Number(numItems));
} else {
  module.exports = { generateMerchandiseInventory };
}