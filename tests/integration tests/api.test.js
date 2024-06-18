const axios = require('axios');

// Example API endpoint URL (adjust based on your actual API endpoint)
const apiUrl = 'http://localhost:3000/api/accounts';

test('POST /api/accounts should save data successfully', async () => {
  const requestData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'user'
  };

  try {
    const response = await axios.post(apiUrl, requestData);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('_id');
    expect(response.data.name).toBe(requestData.name);
    expect(response.data.email).toBe(requestData.email);
    // Add more assertions as needed
  } catch (error) {
    // Handle any errors during the request
    console.error('Error:', error.message);
    throw error;
  }
});
