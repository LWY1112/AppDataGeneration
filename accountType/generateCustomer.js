const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en');

// Define the Malaysian locale object
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

// Function to generate a Malaysian IC number
function generateICNumber() {
  const year = String(faker.number.int({ min: 1950, max: 2003 })).substr(-2);
  const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
  const day = faker.number.int({ min: 1, max: 31 }).toString().padStart(2, '0');
  const sequenceNumber = faker.number.int({ min: 1, max: 9999 }).toString().padStart(4, '0');
  return `${year}${month}${day}${sequenceNumber}`;
}

// Function to generate a random customer
function generateRandomCustomer(statuses, identityTypes, genders, countries) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const identityType = faker.helpers.arrayElement(identityTypes);
  const identityValue = identityType === 'IC' ? generateICNumber() : faker.string.uuid();
  const country = faker.helpers.arrayElement(countries);
  const state = faker.helpers.arrayElement(country.states);

  return {
    name: `${firstName} ${lastName}`,
    identity: {
      type: identityType,
      value: identityValue,
    },
    photo: faker.image.avatar(),
    email: faker.internet.email(),
    phone: malaysianLocale.phone.phoneNumber(),
    DOB: faker.date.between({ from: '1950-01-01', to: '2003-12-31' }).toISOString(),
    gender: faker.helpers.arrayElement(genders),
    note: faker.hacker.phrase(),
    status: faker.helpers.arrayElement(statuses),
    uid: faker.string.uuid(),
    address: {
      street_1: faker.location.streetAddress(),
      street_2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      postcode: faker.location.zipCode(),
      state: state,
      country: country.name,
    },
    nationality: country.name,
  };
}

// Function to fetch data from an API endpoint
async function fetchData(apiEndpoint) {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${apiEndpoint}:`, error);
    return [];
  }
}

// Fetch statuses from API
async function fetchStatuses(apiEndpoint) {
  return fetchData(apiEndpoint);
}

// Fetch identity types from API
async function fetchIdentityTypes(apiEndpoint) {
  return fetchData(apiEndpoint);
}

// Fetch genders from API
async function fetchGenders(apiEndpoint) {
  return fetchData(apiEndpoint);
}

// Fetch countries from API
async function fetchCountries(apiEndpoint) {
  return fetchData(apiEndpoint);
}

module.exports = { generateRandomCustomer, fetchStatuses, fetchIdentityTypes, fetchGenders, fetchCountries };
