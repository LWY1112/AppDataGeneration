
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint to receive and save data
app.post('/saveData', (req, res) => {
  const jsonData = req.body;
  const folderPath = path.join(__dirname, 'data');
  const filePath = path.join(folderPath, 'database.json');

  // Ensure the data folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  // Read existing data from the file (if it exists)
  let existingData = [];
  if (fs.existsSync(filePath)) {
    existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  // Append new data to existing data
  existingData.push(jsonData);

  // Write updated data back to the file
  fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

  res.status(200).json({ message: 'Data received and saved to JSON file' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
