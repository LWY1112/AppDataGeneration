const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const formData = req.body;

    // Read existing data from file
    let data = [];
    const filePath = path.join(__dirname, 'data.json');
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath);
        data = JSON.parse(rawData);
    }

    // Add new form data
    data.push(formData);

    // Save updated data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.send('Form submitted successfully!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
