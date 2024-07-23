const { generateRandomCustomer, fetchStatuses, fetchIdentityTypes, fetchGenders, fetchCountries } = require('./generateCustomer');
const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');

jest.mock('axios');

describe('generateCustomer.js', () => {
  const statuses = ['active', 'inactive'];
  const identityTypes = ['IC', 'Passport'];
  const genders = ['Male', 'Female'];
  const countries = [
    { name: 'Malaysia', states: ['Selangor', 'Penang', 'Johor'] },
    { name: 'Singapore', states: ['Central', 'East', 'West'] }
  ];

  describe('generateRandomCustomer', () => {
    it('should generate a random customer', () => {
      const customer = generateRandomCustomer(statuses, identityTypes, genders, countries);
      
      expect(customer).toHaveProperty('name');
      expect(customer).toHaveProperty('identity.type');
      expect(customer).toHaveProperty('identity.value');
      expect(customer).toHaveProperty('photo');
      expect(customer).toHaveProperty('email');
      expect(customer).toHaveProperty('phone');
      expect(customer).toHaveProperty('DOB');
      expect(customer).toHaveProperty('gender');
      expect(customer).toHaveProperty('note');
      expect(customer).toHaveProperty('status');
      expect(customer).toHaveProperty('uid');
      expect(customer).toHaveProperty('address.street_1');
      expect(customer).toHaveProperty('address.street_2');
      expect(customer).toHaveProperty('address.city');
      expect(customer).toHaveProperty('address.postcode');
      expect(customer).toHaveProperty('address.state');
      expect(customer).toHaveProperty('address.country');
      expect(customer).toHaveProperty('nationality');
      expect(customer).toHaveProperty('shoe_size');
    });

    it('should generate a customer with valid identity type and value', () => {
      const customer = generateRandomCustomer(statuses, identityTypes, genders, countries);
      
      expect(identityTypes).toContain(customer.identity.type);
      if (customer.identity.type === 'IC') {
        expect(customer.identity.value).toMatch(/^\d{8}$/);
      } else {
        expect(customer.identity.value).toMatch(/^[a-f0-9\-]{36}$/);
      }
    });

    it('should generate a customer with valid gender', () => {
      const customer = generateRandomCustomer(statuses, identityTypes, genders, countries);
      
      expect(genders).toContain(customer.gender);
    });
  });

  describe('fetchData', () => {
    const apiEndpoint = 'https://api.example.com/data'; // Replace with actual API URL

    it('should fetch data from API', async () => {
      const mockData = ['data1', 'data2'];
      axios.get.mockResolvedValue({ data: mockData });

      const data = await fetchStatuses(apiEndpoint);
      expect(data).toEqual(mockData);
    });

    it('should handle errors when fetching data', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      const data = await fetchStatuses(apiEndpoint);
      expect(data).toEqual([]);
    });
  });

  describe('fetchStatuses', () => {
    const apiEndpoint = 'https://api.example.com/statuses'; // Replace with actual API URL

    it('should fetch statuses from API', async () => {
      const mockStatuses = ['active', 'inactive'];
      axios.get.mockResolvedValue({ data: mockStatuses });

      const statuses = await fetchStatuses(apiEndpoint);
      expect(statuses).toEqual(mockStatuses);
    });
  });

  describe('fetchIdentityTypes', () => {
    const apiEndpoint = 'https://api.example.com/identity-types'; // Replace with actual API URL

    it('should fetch identity types from API', async () => {
      const mockIdentityTypes = ['IC', 'Passport'];
      axios.get.mockResolvedValue({ data: mockIdentityTypes });

      const identityTypes = await fetchIdentityTypes(apiEndpoint);
      expect(identityTypes).toEqual(mockIdentityTypes);
    });
  });

  describe('fetchGenders', () => {
    const apiEndpoint = 'https://api.example.com/genders'; // Replace with actual API URL

    it('should fetch genders from API', async () => {
      const mockGenders = ['Male', 'Female'];
      axios.get.mockResolvedValue({ data: mockGenders });

      const genders = await fetchGenders(apiEndpoint);
      expect(genders).toEqual(mockGenders);
    });
  });

  describe('fetchCountries', () => {
    const apiEndpoint = 'https://api.example.com/countries'; // Replace with actual API URL

    it('should fetch countries from API', async () => {
      const mockCountries = [
        { name: 'Malaysia', states: ['Selangor', 'Penang', 'Johor'] },
        { name: 'Singapore', states: ['Central', 'East', 'West'] }
      ];
      axios.get.mockResolvedValue({ data: mockCountries });

      const countries = await fetchCountries(apiEndpoint);
      expect(countries).toEqual(mockCountries);
    });
  });
});
