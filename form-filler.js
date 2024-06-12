const { faker } = require('@faker-js/faker/locale/en');
const fs = require('fs');
const path = require('path');

// Custom provider for Malaysian phone numbers
const malaysianLocale = {
  phone: {
    phoneNumber: () => {
      const areaCode = '1' + Math.floor(Math.random() * 10);
      const restOfNumber = Math.floor(Math.random() * 9000000) + 1000000;
      return {
        country_code: '60',  // Malaysia's country code
        number: `${areaCode}${restOfNumber}`
      };
    }
  },
};

// Function to generate a random user account
function generateRandomUser() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const username = faker.internet.userName();
  const roles = ['ADMIN', 'MANAGER', 'STAFF'];

  return {
    _id: username,
    email: faker.internet.email(),
    enable: faker.datatype.boolean(),
    name: `${firstName} ${lastName}`,
    note: faker.hacker.phrase(), 
    password:faker.internet.password({length:10, pattern:/[a-zA-Z0-9_-]/}),  // Alphanumeric password of length 10
    phone: malaysianLocale.phone.phoneNumber(),
    pin: faker.random.numeric(6),  // Numeric string of length 6
    role: [faker.helpers.arrayElement(roles)]  // Randomly select one role
  };
}

// Function to generate a random employee account
function generateRandomEmployee() {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const position = ['Manager', 'Trainer','Full Timer','Part Timer'];

  return {
    _id: faker.internet.userName(),
    name: `${firstName} ${lastName}`,
    position: [faker.helpers.arrayElement(position)],
    email: faker.internet.email(),
    phone: malaysianLocale.phone.phoneNumber(),
    note: faker.hacker.phrase(),
  };
}

// Function to generate and save accounts to a JSON file
async function generateAccounts(numAccounts, type) {
    const accounts = [];
    let generateFunction;
    let fileName;
  
    if (type === 'user') {
      generateFunction = generateRandomUser;
      fileName = 'generated_user_accounts.json';
    } else if (type === 'employee') {
      generateFunction = generateRandomEmployee;
      fileName = 'generated_employee_accounts.json';
    } else {
      console.error('Invalid account type specified.');
      process.exit(1);
    }
  
    for (let i = 0; i < numAccounts; i++) {
      const account = generateFunction();
      console.log(`Generated ${type} Account ${i + 1}:`, account);
      accounts.push(account);
    }
  
    const filePath = path.join(__dirname, 'Database', fileName);
    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2));
    console.log(`Saved ${numAccounts} ${type} accounts to ${filePath}`);
  }
  
  // Check if the number of accounts and type is provided as command-line arguments
  const numAccounts = process.argv[2];
  const accountType = process.argv[3];
  if (!numAccounts || isNaN(numAccounts) || !accountType || !['user', 'employee'].includes(accountType)) {
    console.error('Please provide a valid number of accounts and account type (user/employee) as command-line arguments.');
    process.exit(1);
  }
  
  // Generate the specified number of accounts of the specified type
  generateAccounts(Number(numAccounts), accountType);