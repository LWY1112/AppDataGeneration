const { generateRandomUser, fetchRoles } = require('../accountType/generateUser');
const axios = require('axios');

jest.mock('axios');

describe('generateUser.js tests', () => {
  const roles = ['Admin', 'User'];

  test('generateRandomUser returns a valid user object', () => {
    const user = generateRandomUser(roles);

    expect(user).toHaveProperty('_id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('enable');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('note');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('phone.country_code', '60');
    expect(user).toHaveProperty('phone.number');
    expect(user).toHaveProperty('pin');
    expect(user).toHaveProperty('role');
    expect(user.role.length).toBeGreaterThan(0);
  });

  test('fetchRoles calls the correct API endpoint and returns data', async () => {
    axios.get.mockResolvedValue({ data: roles });
    const result = await fetchRoles('https://batuu.sensoft.cloud:9889/role');

    expect(axios.get).toHaveBeenCalledWith('https://batuu.sensoft.cloud:9889/role');
    expect(result).toEqual(roles);
  });
});
