const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { generateRandomUser } = require('./accountType/generateUser');
const { generateRandomEmployee } = require('./accountType/generateEmployee');
const { generateRandomCustomer } = require('./accountType/generateCustomer');

// Function to generate and save accounts to a JSON file
async function generateAccounts(numAccounts, type) {
  let generateFunction;
  let fileName;
  let apiUrl;

  switch (type) {
    case 'user':
      generateFunction = generateRandomUser;
      fileName = 'generated_user_accounts.json';
      apiUrl = 'https://batuu.sensoft.cloud:9889/v1/users';
      break;
    case 'employee':
      generateFunction = generateRandomEmployee;
      fileName = 'generated_employee_accounts.json';
      apiUrl = 'https://batuu.sensoft.cloud:9889/v1/employees';
      break;
    case 'customer':
      generateFunction = generateRandomCustomer;
      fileName = 'generated_customer_accounts.json';
      apiUrl = 'https://batuu.sensoft.cloud:9889/v1/customers';
      break;
    default:
      console.error('Invalid account type specified.');
      process.exit(1);
  }

  const accounts = [];
  for (let i = 0; i < numAccounts; i++) {
    const account = generateFunction();
    accounts.push(account);
    try {
      const response = await axios.post(apiUrl, account);
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  }

  const filePath = path.join(__dirname, 'database', fileName);

  // Read existing data from the file, if it exists
  let existingAccounts = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    existingAccounts = JSON.parse(fileContent);
  }

  // Append new accounts to the existing ones
  const updatedAccounts = existingAccounts.concat(accounts);

  // Save the updated accounts back to the file
  fs.writeFileSync(filePath, JSON.stringify(updatedAccounts, null, 2));
  console.log(`Saved ${numAccounts} ${type} accounts to ${filePath}`);
}

// Check if the number of accounts and type is provided as command-line arguments
const numAccounts = process.argv[2];
const accountType = process.argv[3];
if (!numAccounts || isNaN(numAccounts) || !accountType || !['user', 'employee', 'customer'].includes(accountType)) {
  console.error('Please provide a valid number of accounts and account type (user/employee/customer) as command-line arguments.');
  process.exit(1);
}

// Generate the specified number of accounts of the specified type
generateAccounts(Number(numAccounts), accountType);
