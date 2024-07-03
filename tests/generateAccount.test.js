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

  //generateAccounts generates user accounts and saves them to a file
  test('user', async () => {
    const numAccounts = 2;
    const type = 'user';

    const roles = ['Admin', 'User'];
    const userAccount = { "name": "Meghan Cruickshank",
    "identity": {
      "type": "PASSPORT",
      "value": "688ecc8e-449d-439a-b93c-5a1d265d1f39"
    },
    "photo": "https://avatars.githubusercontent.com/u/60182470",
    "email": "Cloyd_Zulauf-Conroy97@hotmail.com",
    "phone": {
      "country_code": "60",
      "number": "157940617"
    },
    "DOB": "2001-04-15T01:43:11.917Z",
    "gender": "FEMALE",
    "note": "If we override the capacitor, we can get to the COM feed through the back-end COM application!",
    "status": "INACTIVE",
    "enable": false,
    "uid": "103da30e-cec6-4670-8696-8a3eaa321948" };

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

  //generateAccounts generates employee accounts and saves them to a file
  test('employee', async () => {
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

  //generateAccounts generates customer accounts and saves them to a file
  test('customer', async () => {
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
