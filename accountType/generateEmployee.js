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

function generateRandomEmployee() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const positions = ['MANAGER', 'TRAINER', 'FULL TIMER', 'PART TIMER'];

  return {
    name: `${firstName} ${lastName}`,
    position: faker.helpers.arrayElement(positions),
    email: faker.internet.email(),
    phone: malaysianLocale.phone.phoneNumber(),
    note: faker.hacker.phrase(),
  };
}

module.exports = { generateRandomEmployee };
