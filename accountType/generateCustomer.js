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

function generateICNumber() {
  const year = String(faker.number.int({ min: 1950, max: 2003 })).substr(-2);
  const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
  const day = faker.number.int({ min: 1, max: 31 }).toString().padStart(2, '0');
  const sequenceNumber = faker.number.int({ min: 1, max: 9999 }).toString().padStart(4, '0');
  return `${year}${month}${day}${sequenceNumber}`;
}

function generateRandomCustomer() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const identityTypes = ['IC', 'PASSPORT'];
  const statuses = ['REGISTERED', 'ACTIVE', 'BANNED', 'TERMINATED'];
  
  const identityType = faker.helpers.arrayElement(identityTypes);
  let identityValue;

  if (identityType === 'IC') {
    identityValue = generateICNumber();
  } else if (identityType === 'PASSPORT') {
    identityValue = faker.datatype.uuid();
  }

  return {
    _id: faker.internet.userName(),
    name: `${firstName} ${lastName}`,
    identity: {
      type: identityType,
      value: identityValue,
    },
    photo: faker.image.avatar(),
    email: faker.internet.email(),
    phone: malaysianLocale.phone.phoneNumber(),
    DOB: faker.date.between({ from: '1950-01-01', to: '2003-12-31' }).toISOString(),
    gender: faker.helpers.arrayElement(['MALE', 'FEMALE']),
    tag: [
      {
        color: faker.internet.color(),
        text: faker.lorem.word(),
      }
    ],
    certs: [
      {
        name: faker.lorem.words(2),
        date: faker.date.past().toISOString(),
        certifier: faker.company.name(), // Corrected to companyName()
      }
    ],
    note: faker.hacker.phrase(),
    status: faker.helpers.arrayElement(statuses),
    enable: faker.datatype.boolean(),
    uid: faker.string.uuid(),
  };
}

module.exports = { generateRandomCustomer };
