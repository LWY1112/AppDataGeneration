const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');
const fs = require('fs');
const path = require('path');

// API endpoints
const customersApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/list/POS';
const waiversApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/waivers/list/POS';
const addWaiverApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/add_waiver';

// Function to fetch active customers
const fetchCustomers = async () => {
  try {
    const response = await axios.post(customersApiEndpoint, {
      query: { status: 'ACTIVE' }
    });
    return response.data.customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Function to fetch available waivers
const fetchWaivers = async () => {
  try {
    const response = await axios.post(waiversApiEndpoint);
    return response.data.waivers;
  } catch (error) {
    console.error('Error fetching waivers:', error);
    return [];
  }
};

// Function to add a waiver to a customer
const addWaiverToCustomer = async (customer_id, waiver_id, signatory, signature) => {
  try {
    const response = await axios.post(addWaiverApiEndpoint, {
      customer_id,
      waiver_id,
      signatory,
      signature
    });
    return response.data;
  } catch (error) {
    console.error('Error adding waiver to customer:', error);
    return null;
  }
};

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Function to assign waivers to customers
const assignWaiversToCustomers = async (numAssignments) => {
  try {
    const customers = await fetchCustomers();
    const waivers = await fetchWaivers();

    if (customers.length === 0 || waivers.length === 0) {
      console.error('No customers or waivers available for assignment.');
      return;
    }

    // Ensure there are enough customers for the requested number of assignments
    if (customers.length < numAssignments) {
      console.error('Not enough customers available for the requested number of assignments.');
      return;
    }

    // Shuffle arrays using a custom shuffle function
    const selectedCustomers = shuffleArray(customers).slice(0, numAssignments);
    const waiver_id = shuffleArray(waivers)[0]._id;

    const results = [];

    for (let i = 0; i < numAssignments; i++) {
      const customer_id = selectedCustomers[i]?._id;

      if (!customer_id || !waiver_id) {
        console.error('Error: Invalid customer or waiver data');
        continue;
      }

      // Randomly decide if the signatory is the same customer or another customer
      const signatory = faker.datatype.boolean()
        ? customer_id
        : shuffleArray(customers.filter(c => c._id !== customer_id))[0]?._id;

      // Generate a random signature
      const signature = faker.lorem.words(3);

      const result = await addWaiverToCustomer(customer_id, waiver_id, signatory, signature);
      if (result) {
        console.log(`Successfully added waiver ${waiver_id} to customer ${customer_id} with signatory ${signatory} and signature ${signature}`);
        results.push({ customer_id, waiver_id, signatory, signature });
      }
    }

    // Save results to a JSON file
    const filePath = path.join(__dirname, 'database', 'waiverAssign.json');
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`Successfully saved ${results.length} waiver assignments to ${filePath}`);
  } catch (error) {
    console.error('Error generating and posting waiver assignments:', error.message);
  }
};

// Check if the number of assignments is provided as a command-line argument
if (require.main === module) {
  const numAssignments = process.argv[2];
  if (!numAssignments || isNaN(numAssignments)) {
    console.error('Please provide a valid number of assignments as a command-line argument.');
    process.exit(1);
  }
  assignWaiversToCustomers(Number(numAssignments));
} else {
  module.exports = { assignWaiversToCustomers };
}
