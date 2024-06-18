const { generateRandomProduct } = require('../../form-filler.js');

test('generateRandomProduct creates a valid product object', () => {
  const product = generateRandomProduct();
  expect(product).toHaveProperty('name');
  expect(product).toHaveProperty('desc');
  expect(product).toHaveProperty('images');
  expect(Array.isArray(product.images)).toBe(true);
  expect(product).toHaveProperty('sequence');
  expect(product).toHaveProperty('enable');
});
