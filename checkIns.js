const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');
const fs = require('fs');
const path = require('path');

// API endpoints
const customersApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/list/POS';
const terminalsApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/terminals/list';
const checkInApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/visits/checkin';

// Function to fetch active customers
const fetchCustomers = async () => {
  try {
    const response = await axios.post(customersApiEndpoint, {
      query: { status: 'ACTIVE' }
    });
    if (response.data && response.data.customers) {
      console.log('Fetched customers:', response.data.customers);
      return response.data.customers;
    } else {
      console.error('Unexpected customer API response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Function to fetch terminals with 'ENTRANCE' path
const fetchTerminals = async () => {
  try {
    const response = await axios.post(terminalsApiEndpoint, {
      query: { path: 'ENTRANCE' }
    });
    if (Array.isArray(response.data)) {
      console.log('Fetched terminals:', response.data);
      return response.data;
    } else {
      console.error('Unexpected terminal API response structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching terminals:', error);
    return [];
  }
};

// Function to check in a customer at a terminal
const checkInCustomer = async (customer_id, ticket_id, terminal) => {
  try {
    const response = await axios.post(checkInApiEndpoint, {
      customer_id,
      ticket_id,
      terminal
    });
    return response.data;
  } catch (error) {
    console.error('Error checking in customer:', error);
    return null;
  }
};

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Function to generate and post check-ins
const generateCheckIns = async (numCheckIns) => {
  try {
    const customers = await fetchCustomers();
    const terminals = await fetchTerminals();

    if (!customers || customers.length === 0 || !terminals || terminals.length === 0) {
      console.error('No customers or terminals available for check-in.');
      return;
    }

    // Ensure there are enough customers for the requested number of check-ins
    if (customers.length < numCheckIns) {
      console.error('Not enough customers available for the requested number of check-ins.');
      return;
    }

    // Shuffle arrays using a custom shuffle function
    const selectedCustomers = shuffleArray(customers).slice(0, numCheckIns);
    const selectedTerminals = shuffleArray(terminals);

    const results = [];

    for (let i = 0; i < numCheckIns; i++) {
      const customer_id = selectedCustomers[i]._id;
      const terminal = selectedTerminals[i % selectedTerminals.length]._id;
      const ticket_id = faker.datatype.uuid();

      console.log(`Attempting to check in customer ${customer_id} at terminal ${terminal} with ticket ${ticket_id}`);
      const result = await checkInCustomer(customer_id, ticket_id, terminal);
      if (result) {
        console.log(`Successfully checked in customer ${customer_id} at terminal ${terminal} with ticket ${ticket_id}`);
        results.push({ customer_id, terminal, ticket_id });
      }
    }

    // Save results to a JSON file
    const filePath = path.join(__dirname, 'database', 'checkInAssignments.json');
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`Successfully saved ${results.length} check-in assignments to ${filePath}`);
  } catch (error) {
    console.error('Error generating and posting check-in assignments:', error.message);
  }
};

// Check if the number of check-ins is provided as a command-line argument
if (require.main === module) {
  const numCheckIns = process.argv[2];
  if (!numCheckIns || isNaN(numCheckIns)) {
    console.error('Please provide a valid number of check-ins as a command-line argument.');
    process.exit(1);
  }
  generateCheckIns(Number(numCheckIns));
} else {
  module.exports = { generateCheckIns };
}
