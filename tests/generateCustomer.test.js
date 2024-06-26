const { generateRandomCustomer, fetchStatuses, fetchIdentityTypes, fetchGenders } = require('./generateCustomer');
const axios = require('axios');

jest.mock('axios');

describe('generateCustomer.js tests', () => {
  const statuses = ['active', 'inactive'];
  const identityTypes = ['IC', 'PASSPORT'];
  const genders = ['MALE', 'FEMALE'];

  test('generateRandomCustomer returns a valid customer object', () => {
    const customer = generateRandomCustomer(statuses, identityTypes, genders);

    expect(customer).toHaveProperty('name');
    expect(customer).toHaveProperty('identity.type');
    expect(customer).toHaveProperty('identity.value');
    expect(customer).toHaveProperty('photo');
    expect(customer).toHaveProperty('email');
    expect(customer).toHaveProperty('phone.country_code', '60');
    expect(customer).toHaveProperty('phone.number');
    expect(customer).toHaveProperty('DOB');
    expect(customer).toHaveProperty('gender');
    expect(customer).toHaveProperty('status');
    expect(customer).toHaveProperty('enable');
    expect(customer).toHaveProperty('uid');
  });

  test('fetchStatuses calls the correct API endpoint and returns data', async () => {
    axios.get.mockResolvedValue({ data: statuses });
    const result = await fetchStatuses('dummyEndpoint');

    expect(axios.get).toHaveBeenCalledWith('dummyEndpoint');
    expect(result).toEqual(statuses);
  });

  test('fetchIdentityTypes calls the correct API endpoint and returns data', async () => {
    axios.get.mockResolvedValue({ data: identityTypes });
    const result = await fetchIdentityTypes('dummyEndpoint');

    expect(axios.get).toHaveBeenCalledWith('dummyEndpoint');
    expect(result).toEqual(identityTypes);
  });

  test('fetchGenders calls the correct API endpoint and returns data', async () => {
    axios.get.mockResolvedValue({ data: genders });
    const result = await fetchGenders('dummyEndpoint');

    expect(axios.get).toHaveBeenCalledWith('dummyEndpoint');
    expect(result).toEqual(genders);
  });
});
