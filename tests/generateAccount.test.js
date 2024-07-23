const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { generateAccounts } = require('../generateAccount');
const { generateRandomUser, fetchRoles } = require('../accountType/generateUser');
const { generateRandomEmployee, fetchPositions } = require('../accountType/generateEmployee');
const { generateRandomCustomer, fetchStatuses, fetchIdentityTypes, fetchGenders, fetchCountries } = require('../accountType/generateCustomer');

jest.mock('axios');
jest.mock('fs');
jest.mock('../accountType/generateUser');
jest.mock('../accountType/generateEmployee');
jest.mock('../accountType/generateCustomer');

describe('generateAccounts tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // Test for generating user accounts and saving them to a file
  test('user', async () => {
    const numAccounts = 2;
    const type = 'user';

    const roles = ['Admin', 'User'];
    const userAccount = {
      _id: 'Karine17',
      email: 'Mya_Feest@yahoo.com',
      enable: true,
      name: 'Shawna Reinger',
      note: "You can't navigate the sensor without parsing the primary DRAM sensor!",
      password: 'eyWDevwNbp',
      phone: {
        country_code: '60',
        number: '109713453'
      },
      pin: '229462',
      role: [
        'ADMIN',
        'MANAGER',
        'STAFF'
      ]
    };

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

  // Test for generating employee accounts and saving them to a file
  test('employee', async () => {
    const numAccounts = 2;
    const type = 'employee';

    const positions = ['Manager', 'Developer'];
    const employeeAccount = {
      name: 'Sydney Pollich',
      position: 'FULL TIMER',
      email: 'Sabrina.Kuhn@hotmail.com',
      phone: {
        country_code: '60',
        number: '138799633'
      },
      note: 'Try to hack the SAS hard drive, maybe it will index the bluetooth alarm!'
    };

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

  // Test for generating customer accounts and saving them to a file
  test('customer', async () => {
    const numAccounts = 2;
    const type = 'customer';

    const statuses = ['REGISTERED', 'ACTIVE', 'INACTIVE', 'BANNED', 'TERMINATED'];
    const identityTypes = ['IC', 'PASSPORT'];
    const genders = ['MALE', 'FEMALE'];
    const countries = [
      { name: 'Malaysia', states: ['Selangor', 'Penang', 'Johor'] },
      { name: 'Singapore', states: ['Central', 'East', 'West'] }
    ];

    const customerAccount = {
      name: 'Meghan Cruickshank',
      identity: {
        type: 'PASSPORT',
        value: '688ecc8e-449d-439a-b93c-5a1d265d1f39'
      },
      photo: 'https://avatars.githubusercontent.com/u/60182470',
      email: 'Cloyd_Zulauf-Conroy97@hotmail.com',
      phone: {
        country_code: '60',
        number: '157940617'
      },
      DOB: '2001-04-15T01:43:11.917Z',
      gender: 'FEMALE',
      note: 'If we override the capacitor, we can get to the COM feed through the back-end COM application!',
      status: 'INACTIVE',
      enable: false,
      uid: '103da30e-cec6-4670-8696-8a3eaa321948',
      address: {
        street_1: '123 Main St',
        street_2: 'Apt 4B',
        city: 'Kuala Lumpur',
        postcode: '50000',
        state: 'Selangor',
        country: 'Malaysia'
      },
      nationality: 'Malaysia',
      shoe_size: 'UK9'
    };

    fetchStatuses.mockResolvedValue(statuses);
    fetchIdentityTypes.mockResolvedValue(identityTypes);
    fetchGenders.mockResolvedValue(genders);
    fetchCountries.mockResolvedValue(countries);
    generateRandomCustomer.mockReturnValue(customerAccount);
    axios.post.mockResolvedValue({ data: { message: 'Success' } });
    fs.existsSync.mockReturnValue(false);
    fs.writeFileSync.mockImplementation(() => {});

    await generateAccounts(numAccounts, type);

    expect(fetchStatuses).toHaveBeenCalled();
    expect(fetchIdentityTypes).toHaveBeenCalled();
    expect(fetchGenders).toHaveBeenCalled();
    expect(fetchCountries).toHaveBeenCalled();
    expect(generateRandomCustomer).toHaveBeenCalledWith(statuses, identityTypes, genders, countries);
    expect(axios.post).toHaveBeenCalledWith('https://batuu.sensoft.cloud:9889/v1/customers', customerAccount);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(__dirname, '../database', 'generated_customer_accounts.json'),
      JSON.stringify([customerAccount, customerAccount], null, 2)
    );
  });
});
