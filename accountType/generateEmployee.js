const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');

const malaysianLocale = {
  phone: {
    phoneNumber: () => {
      const areaCode = '1' + Math.floor(Math.random() * 10);
      const restOfNumber = Math.floor(Math.random() * 9000000) + 1000000;
      return {
        country_code: '60',  // Malaysia's country code
        number: `${areaCode}${restOfNumber}`
      };
    }
  },
};

async function fetchPositions(apiEndpoint) {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data; // Assuming the API returns an array of positions
  } catch (error) {
    console.error('Error fetching positions:', error);
    return []; // Return an empty array if there's an error
  }
}

function generateRandomEmployee(positions) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    name: `${firstName} ${lastName}`,
    position: faker.helpers.arrayElement(positions),
    email: faker.internet.email(),
    phone: malaysianLocale.phone.phoneNumber(),
    note: faker.hacker.phrase(),
  };
}

module.exports = { generateRandomEmployee, fetchPositions };
