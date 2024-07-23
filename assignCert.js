const fs = require('fs');
const path = require('path');
const axios = require('axios');
const faker = require('@faker-js/faker/locale/en');

// API endpoints
const certsApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/certs/list/POS';
const customersApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/list/POS';
const assignCertApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/add_cert';

// Path to save the assignments
const assignmentsJsonPath = path.join(__dirname, 'database', 'certAssign.json');

// Function to fetch certificates from API
const fetchCerts = async () => {
  try {
    const response = await axios.post(certsApiEndpoint);
    return response.data.certs;
  } catch (error) {
    console.error('Error fetching certs:', error);
    return [];
  }
};

// Function to fetch customer IDs from API
const fetchCustomers = async () => {
  try {
    const response = await axios.post(customersApiEndpoint, { query: { status: "ACTIVE" } });
    return response.data.customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Function to assign a certificate to a customer
const assignCertToCustomer = async (customer_id, cert_id) => {
  try {
    const response = await axios.post(assignCertApiEndpoint, { customer_id, cert_id });
    return response.data;
  } catch (error) {
    console.error('Error assigning cert to customer:', error);
    return null;
  }
};

// Function to get a random element from an array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Function to check if a customer already has a certificate
const customerHasCert = (customer, cert) => {
  return customer.certs.some(c => c.name === cert.name);
};

// Function to generate and post certificate assignments
const assignCertsToCustomers = async (numAssignments) => {
  try {
    const certs = await fetchCerts();
    const customers = await fetchCustomers();

    if (certs.length === 0 || customers.length === 0) {
      console.error('No certs or customers available for assignment.');
      return;
    }

    const assignments = [];
    const customerAssignments = {};

    for (let i = 0; i < numAssignments; i++) {
      const customer = getRandomElement(customers);
      const availableCerts = certs.filter(cert => !customerHasCert(customer, cert));

      if (availableCerts.length === 0) {
        console.log(`Customer ${customer._id} already has all certs.`);
        continue;
      }

      const cert = getRandomElement(availableCerts);
      const cert_id = cert._id;
      const customer_id = customer._id;

      const result = await assignCertToCustomer(customer_id, cert_id);
      if (result) {
        console.log(`Successfully assigned cert ${cert_id} (${cert.name}) to customer ${customer_id}`);
        assignments.push({ customer_id, cert_id });

        // Track assigned certs to avoid duplicates in subsequent iterations
        if (!customerAssignments[customer_id]) {
          customerAssignments[customer_id] = new Set();
        }
        customerAssignments[customer_id].add(cert.name);

        // Update the customer certs to reflect the new assignment
        customer.certs.push({ id: cert_id, name: cert.name });
      }
    }

    // Save the assignments to a JSON file
    fs.writeFileSync(assignmentsJsonPath, JSON.stringify(assignments, null, 2));
    console.log(`Successfully saved ${assignments.length} assignments to ${assignmentsJsonPath}`);
  } catch (error) {
    console.error('Error generating and posting cert assignments:', error.message);
  }
};

// Check if the number of assignments is provided as a command-line argument
if (require.main === module) {
  const numAssignments = process.argv[2];
  if (!numAssignments || isNaN(numAssignments)) {
    console.error('Please provide a valid number of assignments as a command-line argument.');
    process.exit(1);
  }
  assignCertsToCustomers(Number(numAssignments));
} else {
  module.exports = { assignCertsToCustomers };
}
