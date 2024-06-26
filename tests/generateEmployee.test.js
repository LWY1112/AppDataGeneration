const { generateRandomEmployee, fetchPositions } = require('./generateEmployee');
const axios = require('axios');

jest.mock('axios');

describe('generateEmployee.js tests', () => {
  const positions = ['Manager', 'Developer'];

  test('generateRandomEmployee returns a valid employee object', () => {
    const employee = generateRandomEmployee(positions);

    expect(employee).toHaveProperty('name');
    expect(employee).toHaveProperty('position');
    expect(employee).toHaveProperty('email');
    expect(employee).toHaveProperty('phone.country_code', '60');
    expect(employee).toHaveProperty('phone.number');
    expect(employee).toHaveProperty('note');
  });

  test('fetchPositions calls the correct API endpoint and returns data', async () => {
    axios.get.mockResolvedValue({ data: positions });
    const result = await fetchPositions('dummyEndpoint');

    expect(axios.get).toHaveBeenCalledWith('dummyEndpoint');
    expect(result).toEqual(positions);
  });
});
