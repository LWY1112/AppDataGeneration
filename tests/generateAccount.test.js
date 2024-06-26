const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { generateAccounts } = require('../generateAccount');
const { generateRandomUser, fetchRoles } = require('../accountType/generateUser');
const { generateRandomEmployee, fetchPositions } = require('../accountType/generateEmployee');
const { generateRandomCustomer, fetchStatuses, fetchIdentityTypes, fetchGenders } = require('../accountType/generateCustomer');

jest.mock('axios');
jest.mock('fs');
jest.mock('../accountType/generateUser');
jest.mock('../accountType/generateEmployee');
jest.mock('../accountType/generateCustomer');

describe('generateAccounts tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('generateAccounts generates user accounts and saves them to a file', async () => {
    const numAccounts = 2;
    const type = 'user';

    const roles = ['Admin', 'User'];
    const userAccount = { name: 'Test User', role: ['Admin'] };

    fetchRoles.mockResolvedValue(roles);
    generateRandomUser.mockReturnValue(userAccount);
    axios.post.mockResolvedValue({ data: { message: 'Success' } });
    fs.existsSync.mockReturnValue(false);
    fs.writeFileSync.mockImplementation(() => {});

    await generateAccounts(numAccounts, type);

    expect(fetchRoles).toHaveBeenCalled();
    expect(generateRandomUser).toHaveBeenCalledWith(roles);
    expect(axios.post).toHaveBeenCalledWith('https://batuu.sensoft.cloud:9889/v1/users', userAccount);
    expect(fs.writeFileSync).toHaveBeenCalledWith(path.join(__dirname, '../database', 'generated_user_accounts.json'), JSON.stringify([userAccount, userAccount], null, 2));
  });

  test('generateAccounts generates employee accounts and saves them to a file', async () => {
    const numAccounts = 2;
    const type = 'employee';

    const positions = ['Manager', 'Developer'];
    const employeeAccount = { name: 'Test Employee', position: 'Manager' };

    fetchPositions.mockResolvedValue(positions);
    generateRandomEmployee.mockReturnValue(employeeAccount);
    axios.post.mockResolvedValue({ data: { message: 'Success' } });
    fs.existsSync.mockReturnValue(false);
    fs.writeFileSync.mockImplementation(() => {});

    await generateAccounts(numAccounts, type);

    expect(fetchPositions).toHaveBeenCalled();
    expect(generateRandomEmployee).toHaveBeenCalledWith(positions);
    expect(axios.post).toHaveBeenCalledWith('https://batuu.sensoft.cloud:9889/v1/employees', employeeAccount);
    expect(fs.writeFileSync).toHaveBeenCalledWith(path.join(__dirname, '../database', 'generated_employee_accounts.json'), JSON.stringify([employeeAccount, employeeAccount], null, 2));
  });

  test('generateAccounts generates customer accounts and saves them to a file', async () => {
    const numAccounts = 2;
    const type = 'customer';
  
    const statuses = ['REGISTERED','ACTIVE','INACTIVE','BANNED','TERMINATED'];
    const identityTypes = ['IC','PASSPORT'];
    const genders = ['MALE', 'FEMALE'];
    const customerAccount = { name: 'Test Customer', status: 'active' };
  
    // Mock the async functions
    fetchStatuses.mockResolvedValue(statuses);
    fetchIdentityTypes.mockResolvedValue(identityTypes);
    fetchGenders.mockResolvedValue(genders);
    generateRandomCustomer.mockReturnValue(customerAccount);
    axios.post.mockResolvedValue({ data: { message: 'Success' } });
    fs.existsSync.mockReturnValue(false);
    fs.writeFileSync.mockImplementation(() => {});
  
    // Call the function under test
    await generateAccounts(numAccounts, type);
  
    // Assertions
    expect(fetchStatuses).toHaveBeenCalled();
    expect(fetchIdentityTypes).toHaveBeenCalled();
    expect(fetchGenders).toHaveBeenCalled();
    expect(generateRandomCustomer).toHaveBeenCalledTimes(2); // Ensure it's called twice
    expect(axios.post).toHaveBeenCalledWith('https://batuu.sensoft.cloud:9889/v1/customers', customerAccount);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(__dirname, '../database', 'generated_customer_accounts.json'),
      JSON.stringify([customerAccount, customerAccount], null, 2)
    );
  }); 
});
