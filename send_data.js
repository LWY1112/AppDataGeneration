// sendData.js

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Read the JSON file from the data folder
const jsonFilePath = path.join(__dirname, 'database', 'generated_user_accounts.json');
const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

// Send the data using Axios
axios.post('http://localhost:3000/saveData', jsonData)
  .then(response => {
    console.log('Data sent successfully:', response.data);
  })
  .catch(error => {
    console.error('Error sending data:', error);
  });
