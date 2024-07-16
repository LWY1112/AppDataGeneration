const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');
const XLSX = require('xlsx');

// API endpoints
const merchandisesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/merchandises/list/ADMIN';
const sitesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/sites/list/POS';
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
  const site = faker.helpers.arrayElement(sites)._id;
  const quantity = faker.number.int({ min: 1, max: 100 });
  const remark = faker.datatype.boolean() ? faker.hacker.phrase() : '';

  return {
    product_id: merchandise._id,
    sku: merchandise.sku,
    site: site,
    quantity: quantity,
    remark: remark,
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
    const excelInventoryItems = inventoryItems.map(({ site, sku, quantity, remark }) => ({
      site,
      sku,
      quantity,
      remark,
    }));

    // Save the simplified inventory to an Excel file
    const worksheet = XLSX.utils.json_to_sheet(excelInventoryItems);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
    XLSX.writeFile(workbook, generateInventoryExcelPath);
    console.log(`Successfully saved ${numItems} inventory items to ${generateInventoryExcelPath}`);
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
