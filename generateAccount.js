const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { generateRandomUser, fetchRoles } = require('./accountType/generateUser');
const { generateRandomEmployee, fetchPositions } = require('./accountType/generateEmployee');
const { generateRandomCustomer, fetchStatuses, fetchIdentityTypes, fetchGenders, fetchCountries } = require('./accountType/generateCustomer');

// Function to generate and save accounts to a JSON file
async function generateAccounts(numAccounts, type) {
  let generateFunction;
  let fileName;
  let apiUrl;
  let roles = [];
  let positions = [];
  let statuses = [];
  let identityTypes = ['IC', 'PASSPORT']; // Default identity types
  let genders = ['MALE', 'FEMALE']; // Default genders
  let countries = [];

  switch (type) {
    case 'user':
      generateFunction = generateRandomUser;
      fileName = 'generated_user_accounts.json';
      apiUrl = 'https://batuu.sensoft.cloud:9889/v1/users';

      const rolesApiEndpoint = 'https://batuu.sensoft.cloud:9889/role';
      roles = await fetchRoles(rolesApiEndpoint);
      if (roles.length === 0) {
        console.error('No roles available, cannot generate users.');
        return;
      }
      break;
      
    case 'employee':
      generateFunction = generateRandomEmployee;
      fileName = 'generated_employee_accounts.json';
      apiUrl = 'https://batuu.sensoft.cloud:9889/v1/employees';

      const positionsApiEndpoint = 'https://batuu.sensoft.cloud:9889/position';
      positions = await fetchPositions(positionsApiEndpoint);
      if (positions.length === 0) {
        console.error('No positions available, cannot generate employees.');
        return;
      }
      break;
      
    case 'customer':
      generateFunction = generateRandomCustomer;
      fileName = 'generated_customer_accounts.json';
      apiUrl = 'https://batuu.sensoft.cloud:9889/v1/customers';

      const statusesApiEndpoint = 'https://batuu.sensoft.cloud:9889/v1/customers/status';
      statuses = await fetchStatuses(statusesApiEndpoint);
      if (statuses.length === 0) {
        console.error('No statuses available, cannot generate customers.');
        return;
      }

      const identityTypesApiEndpoint = 'https://batuu.sensoft.cloud:9889/identity_type';
      identityTypes = await fetchIdentityTypes(identityTypesApiEndpoint);
      if (identityTypes.length === 0) {
        console.error('No types available, cannot generate customers.');
        return;
      }

      const gendersApiEndpoint = 'https://batuu.sensoft.cloud:9889/gender';
      genders = await fetchGenders(gendersApiEndpoint);
      if (genders.length === 0) {
        console.error('No gender available, cannot generate customers.');
        return;
      }

      const countriesApiEndpoint = 'https://batuu.sensoft.cloud:9889/countries';
      countries = await fetchCountries(countriesApiEndpoint);
      if (countries.length === 0) {
        console.error('No countries available, cannot generate customers.');
        return;
      }
      break;
      
    default:
      console.error('Invalid account type specified.');
      process.exit(1);
  }

  const accounts = [];
  for (let i = 0; i < numAccounts; i++) {
    const account = type === 'user' ? generateFunction(roles) 
      : type === 'employee' ? generateFunction(positions) 
      : generateFunction(statuses, identityTypes, genders, countries);
    accounts.push(account);
    try {
      const response = await axios.post(apiUrl, account);
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error.response ? error.response.data : error.message);
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
if (require.main === module) {
  const numAccounts = process.argv[2];
  const accountType = process.argv[3];
  if (!numAccounts || isNaN(numAccounts) || !['user', 'employee', 'customer'].includes(accountType)) {
    console.error('Please provide a valid number of accounts and account type (user/employee/customer) as command-line arguments.');
    process.exit(1);
  }
  generateAccounts(Number(numAccounts), accountType);
} else {
  module.exports = { generateAccounts };
}