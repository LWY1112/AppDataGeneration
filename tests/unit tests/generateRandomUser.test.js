const { generateRandomUser } = require('../../form-filler.js');

test('generateRandomUser creates a valid user object', () => {
  const user = generateRandomUser();
  expect(user).toHaveProperty('_id');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('enable');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('note');
  expect(user).toHaveProperty('password');
  expect(user).toHaveProperty('phone');
  expect(user).toHaveProperty('pin');
  expect(user).toHaveProperty('role');
});
