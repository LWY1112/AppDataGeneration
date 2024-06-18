const { generateRandomEmployee } = require('../../form-filler.js');

test('generateRandomEmployee creates a valid employee object', () => {
  const employee = generateRandomEmployee();
  expect(employee).toHaveProperty('_id');
  expect(employee).toHaveProperty('name');
  expect(employee).toHaveProperty('position');
  expect(employee).toHaveProperty('email');
  expect(employee).toHaveProperty('phone');
  expect(employee).toHaveProperty('note');
});
