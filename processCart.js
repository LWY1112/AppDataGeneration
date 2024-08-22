const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker/locale/en');

// API endpoints
const customersApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/list/POS';
const merchandisesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/merchandises/list/ADMIN';
const passesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/passes/list/ADMIN';
const processedCartApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/orders/process_cart';
const checkoutOrderApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/orders/store_checkout';

// File paths
const generateOrderJsonPath = path.join(__dirname, 'database', 'processCart.json');
const processedCartJsonPath = (itemType) => path.join(__dirname, 'database', `processCart${itemType.charAt(0).toUpperCase() + itemType.slice(1)}.json`);

// Function to fetch customers
const fetchCustomers = async () => {
  try {
    const response = await axios.post(customersApiEndpoint);
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
  const quantity = faker.number.int({ min: 1, max: 5 });

  const generatedItem = {
    _id: item._id,
    name: item.name,
    sku: item.sku,
    category: item.category,
    desc: item.desc || null,
    type: type.toUpperCase(),
    quantity: quantity,
    unit_price: {
      currency: 'MYR',
      value: item.unit_price[0].value,
      quantity: 1,
      unit: 'pc'
    }
  };

  if (type !== 'PASS') {
    generatedItem.size = item.size;
  }

  return generatedItem;
};

// Function to generate and post an order
const generateAndPostOrder = async (itemType, orderCount) => {
  try {
    const customers = await fetchCustomers();
    const merchandises = await fetchMerchandises();
    const passes = await fetchPasses();

    if (customers.length === 0 || (merchandises.length === 0 && passes.length === 0)) {
      console.error('No customers or items available for order generation.');
      return;
    }

    let filteredItems = [];
    if (itemType === 'merchandise') {
      filteredItems = merchandises.filter(m => !m.rentable);
    } else if (itemType === 'rental') {
      filteredItems = merchandises.filter(m => m.rentable);
    } else if (itemType === 'pass') {
      filteredItems = passes;
    }

    if (filteredItems.length === 0) {
      console.error(`No ${itemType} available for order generation.`);
      return;
    }

    for (let i = 0; i < orderCount; i++) {
      const selectedCustomer = faker.helpers.arrayElement(customers);

      const itemCount = faker.number.int({ min: 1, max: 5 });
      const selectedItems = faker.helpers.arrayElements(filteredItems, itemCount).map(m => generateRandomItem(m, itemType.toUpperCase()));

      const order = {
        customer: {
          _id: selectedCustomer._id,
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          phone: {
            country_code: selectedCustomer.phone.country_code || 'N/A',
            number: selectedCustomer.phone.number || 'N/A'
          },
          tier: selectedCustomer.tier,
        },
        site: 'BATUU_3DAMANASARA',
        terminal: '547896321203654',
        items: selectedItems
      };

      // Save generated data to JSON file
      const processedCartPath = processedCartJsonPath(itemType);
      fs.writeFileSync(processedCartPath, JSON.stringify(order, null, 2));
      console.log(`Successfully saved order to ${processedCartPath}`);

      // Post to processed cart API
      let processedCartResponse;
      try {
        processedCartResponse = await axios.post(processedCartApiEndpoint, order);
        console.log(`Successfully posted to processed cart API: ${JSON.stringify(processedCartResponse.data)}`);
      } catch (postError) {
        console.error('Error posting to processed cart API:', postError.message);
        continue;
      }

      // Add the payment field with the total amount
      const modifiedOrder = {
        ...processedCartResponse.data,
        payment: {
          method: [
            {
              type: 'CASH',
              amount: processedCartResponse.data.total_amount
            }
          ],
          change: 0
        }
      };

      // Save modified data with the payment field to the JSON file
      fs.writeFileSync(generateOrderJsonPath, JSON.stringify(modifiedOrder, null, 2));
      console.log(`Successfully saved modified order with payment to ${generateOrderJsonPath}`);

      // Post to checkout order API
      try {
        const checkoutResponse = await axios.post(checkoutOrderApiEndpoint, modifiedOrder);
        console.log(`Successfully posted to checkout order API: ${JSON.stringify(checkoutResponse.data)}`);
      } catch (checkoutError) {
        console.error('Error posting to checkout order API:', checkoutError.message);
      }
    }
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