const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { generateRandomUser } = require('./accountType/generateUser');
const { generateRandomEmployee } = require('./accountType/generateEmployee');
const { generateRandomProduct } = require('./accountType/generateProduct');
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
    case 'product':
      generateFunction = generateRandomProduct;
      fileName = 'generated_product_category.json';
      apiUrl = 'https://batuu.sensoft.cloud:9889/v1/categories';
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
  fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
  console.log(`Saved ${numAccounts} ${type} accounts to ${filePath}`);
}

// Check if the number of accounts and type is provided as command-line arguments
const numAccounts = process.argv[2];
const accountType = process.argv[3];
if (!numAccounts || isNaN(numAccounts) || !accountType || !['user', 'employee', 'product','customer'].includes(accountType)) {
  console.error('Please provide a valid number of accounts and account type (user/employee/product) as command-line arguments.');
  process.exit(1);
}

// Generate the specified number of accounts of the specified type
generateAccounts(Number(numAccounts), accountType);
