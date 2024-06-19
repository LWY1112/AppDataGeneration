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

function generateRandomUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const username = faker.internet.userName();
  const roles = ['ADMIN', 'MANAGER', 'STAFF'];

  // Determine the number of roles (1 to the total number of available roles)
  const numberOfRoles = Math.floor(Math.random() * roles.length) + 1;
  
  // Select the roles
  const selectedRoles = [];
  while (selectedRoles.length < numberOfRoles) {
    const role = faker.helpers.arrayElement(roles);
    if (!selectedRoles.includes(role)) {
      selectedRoles.push(role);
    }
  }

  return {
    _id: username,
    email: faker.internet.email(),
    enable: faker.datatype.boolean(),
    name: `${firstName} ${lastName}`,
    note: faker.hacker.phrase(),
    password: faker.internet.password({ length: 10, pattern: /[a-zA-Z0-9_-]/ }),  // Alphanumeric password of length 10
    phone: malaysianLocale.phone.phoneNumber(),
    pin: faker.string.numeric(6),  // Numeric string of length 6
    role: selectedRoles
  };
}

module.exports = { generateRandomUser };
