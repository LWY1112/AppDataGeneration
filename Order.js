const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker/locale/en');

// API endpoints
const customersApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/list/POS';
const merchandisesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/merchandises/list/ADMIN';
const passesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/passes/list/ADMIN';
const orderApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/orders';

// File paths
const generateOrderJsonPath = path.join(__dirname, 'database', 'generateOrder.json');

// Function to fetch customers
const fetchCustomers = async () => {
  try {
    const response = await axios.post(customersApiEndpoint, { query: { status: 'ACTIVE' } });
    return response.data.customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Function to fetch merchandises
const fetchMerchandises = async () => {
  try {
    const response = await axios.post(merchandisesApiEndpoint);
    return response.data.merchandises;
  } catch (error) {
    console.error('Error fetching merchandises:', error);
    return [];
  }
};

// Function to fetch passes
const fetchPasses = async () => {
  try {
    const response = await axios.post(passesApiEndpoint);
    return response.data.passes;
  } catch (error) {
    console.error('Error fetching passes:', error);
    return [];
  }
};

// Function to generate a random item
const generateRandomItem = (item, type) => {
  const quantity = faker.number.int({ min: 1, max: 10 });
  const baseItem = {
    _id: item._id,
    name: item.name,
    sku: item.sku,
    category: item.category,
    desc: item.desc || null,
    quantity: quantity,
    unit_price: item.unit_price[0]
  };
  
  if (type === 'PASS') {
    return baseItem;
  } else {
    return {
      ...baseItem,
      size: item.size || null,
    };
  }
};

// Function to generate and post an order
const generateAndPostOrder = async (itemType, orderCount) => {
  try {
    const customers = await fetchCustomers();
    const merchandises = await fetchMerchandises();
    const passes = await fetchPasses();

    if (customers.length === 0 || (merchandises.length === 0 && passes.length === 0)) {
      console.error('No customers or merchandises/passes available for order generation.');
      return;
    }

    // Read existing orders from the JSON file
    let existingOrders = [];
    if (fs.existsSync(generateOrderJsonPath)) {
      const fileContent = fs.readFileSync(generateOrderJsonPath, 'utf8');
      existingOrders = JSON.parse(fileContent);
    }

    for (let i = 0; i < orderCount; i++) {
      // Randomly select one customer
      const selectedCustomer = faker.helpers.arrayElement(customers);

      // Filter items based on type
      let filteredItems = [];
      if (itemType === 'merchandise') {
        filteredItems = merchandises.filter(m => !m.rentable);
      } else if (itemType === 'rental') {
        filteredItems = merchandises.filter(m => m.rentable);
      } else if (itemType === 'pass') {
        filteredItems = passes;
      }

      // Randomly select a number of items
      const itemCount = faker.number.int({ min: 1, max: 10 });
      
      // Generate random items
      const selectedItems = faker.helpers.arrayElements(filteredItems, itemCount).map(m => generateRandomItem(m, itemType.toUpperCase()));

      // Calculate total items and subtotal
      const totalItems = selectedItems.reduce((acc, item) => acc + item.quantity, 0);
      const subtotal = selectedItems.reduce((acc, item) => acc + (item.unit_price.value * item.quantity), 0);

      // Create the order object
      const order = {
        customer: {
          _id: selectedCustomer._id,
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone,
          tier: selectedCustomer.tier,
        },
        site: 'BATUU_3DAMANASARA',
        terminal: '547896321203654',
        items: selectedItems,
        total_item: totalItems,
        subtotal: subtotal,
        currency: 'MYR',
        total_amount: subtotal,
      };

      // Add the order to the existing orders array
      existingOrders.push(order);

      // Post the order to the API
      try {
        const response = await axios.post(orderApiEndpoint, order);
        console.log(`Successfully posted order: ${JSON.stringify(response.data)}`);
      } catch (postError) {
        console.error('Error posting order:', postError.message);
      }
    }

    // Save the updated orders array to the JSON file
    fs.writeFileSync(generateOrderJsonPath, JSON.stringify(existingOrders, null, 2));
    console.log(`Successfully updated orders in ${generateOrderJsonPath}`);

  } catch (error) {
    console.error('Error generating and posting order:', error.message);
  }
};

// Check if the item type and order count are provided as command-line arguments
if (require.main === module) {
  const itemType = process.argv[2];
  const orderCount = parseInt(process.argv[3], 10);

  if (!itemType || !['merchandise', 'rental', 'pass'].includes(itemType.toLowerCase())) {
    console.error('Please provide a valid item type (merchandise, rental, or pass) as a command-line argument.');
    process.exit(1);
  }

  if (isNaN(orderCount) || orderCount <= 0) {
    console.error('Please provide a valid order count as a command-line argument.');
    process.exit(1);
  }

  generateAndPostOrder(itemType.toLowerCase(), orderCount);
} else {
  module.exports = { generateAndPostOrder };
}
