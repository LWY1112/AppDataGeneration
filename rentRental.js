const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');

// API endpoints
const rentalsApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/rentals/list/POS';
const customersApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/list/POS';
const rentCheckoutApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/rentals/checkout';

// Function to fetch rentals with 'AVAILABLE' status
const fetchRentals = async () => {
  try {
    const response = await axios.post(rentalsApiEndpoint, {
      query: { status: 'AVAILABLE' }
    });
    return response.data.rentals;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return [];
  }
};

// Function to fetch customers with 'ACTIVE' status
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

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Function to rent a rental item to a customer
const rentToCustomer = async (customer_id, rental_id) => {
  try {
    const response = await axios.post(rentCheckoutApiEndpoint, { customer_id, rental_id });
    return response.data;
  } catch (error) {
    console.error('Error renting to customer:', error);
    return null;
  }
};

// Function to generate and post rental assignments
const assignRentalsToCustomers = async (numAssignments) => {
  try {
    const rentals = await fetchRentals();
    const customers = await fetchCustomers();

    if (rentals.length === 0 || customers.length === 0) {
      console.error('No rentals or customers available for assignment.');
      return;
    }

    // Shuffle arrays using a custom shuffle function
    const selectedRentals = shuffleArray(rentals).slice(0, numAssignments);
    const selectedCustomers = shuffleArray(customers).slice(0, numAssignments);

    for (let i = 0; i < numAssignments; i++) {
      const rental_id = selectedRentals[i]._id;
      const customer_id = selectedCustomers[i]._id;

      const result = await rentToCustomer(customer_id, rental_id);
      if (result) {
        console.log(`Successfully rented item ${rental_id} to customer ${customer_id}`);
      }
    }
  } catch (error) {
    console.error('Error generating and posting rental assignments:', error.message);
  }
};

// Check if the number of assignments is provided as a command-line argument
if (require.main === module) {
  const numAssignments = process.argv[2];
  if (!numAssignments || isNaN(numAssignments)) {
    console.error('Please provide a valid number of assignments as a command-line argument.');
    process.exit(1);
  }
  assignRentalsToCustomers(Number(numAssignments));
} else {
  module.exports = { assignRentalsToCustomers };
}
