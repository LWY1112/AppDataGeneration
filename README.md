# Rock Climbing App Data Generation Program

This program generates random information for testing purposes in a rock climbing app. It utilizes the Faker.js library to create mock data for customers, employees, users, merchandise, and inventory. The generated data is then either posted to an API using Axios or used to generate additional lists based on fetched API responses.

## Features

- Generates mock data for:
  - Customers
  - Employees
  - Users
  - Merchandise information
  - Inventory items

- Utilizes Faker.js for realistic data generation.
- Posts generated data to the API using Axios.
- Fetches data from the API to generate additional lists or perform operations.

## Folder and File Descriptions

### Data Generation

All data generation scripts can be run from the terminal:

- **accountType/**: Contains programs for generating account information for different types of users, including customers, employees, and users. These programs are linked to `generateAccount.js`.
  - Run by: `node generateAccount.js (how many you want to generate) (user/customer/employee)`.

- **generateAccount.js**: Main program for the `accountType` folder. Generates account information for users, customers, and employees, referring to specific JSON files like `generate_user_accounts.json`.
  - Run by: `node generateAccount.js (how many you want to generate) (user/customer/employee)`.

- **generateCategory.js**: Script used to create merchandise category names and descriptions. This is a one-time use script and refers to `generateCategory.json`.
  - Run by: `node generateCategory.js`.

- **generateMerchandise.js**: Script used to create merchandise information by referencing `generateMerchandise.json`.
  - Run by: `node generateMerchandise.js`.

- **generateMerchandiseInventory.js**: Script used to generate merchandise inventory information, referring to `generateMerchandiseInventory.json`.
  - Run by: `node generateMerchandiseInventory.js (how many you want to generate)`.

- **generateRental.js**: Script used to generate rental information, referring to `generateRental.json`.
  - Run by: `node generateRental.js (how many you want to generate)`.

- **generateRentalMerchandise.js**: Script used to generate rental merchandise information. It ensures that the merchandise has a `rentable` flag set to true and that SKU and name have a prefix `RENT-` to indicate rental-only items. It refers to `rentalMerchandise.json`.
  - Run by: `node generateRentalMerchandise.js`.

- **processCart.js**: Script used to generate processed cart information. It refers to different JSON files based on the item type:
  - Merchandise: `processCartMerchandise.json`
  - Rental: `processCartRental.json`
  - Pass: `processCartPass.json`
  - Checkout Order: `processCart.json`
  
  After generating the processed cart data, it sends the data to the `proccesedCart` API, receives the processed information, and then sends it to the `checkout order` API.
  - Run by: `node proccesedCart.js (merchandise/rental/pass) (how many you want to generate)`.

- **Rental.js**: Script used to create information for renting and returning merchandise.
  - Run by: `node Rental.js (how many you want to generate) (rent/return)`.

- **assignCert.js**: Script used to assign certifications to customers. It refers to `certAssign.json`.
  - Run by: `node assignCert.js (how many you want to generate)`.

- **assignWaiver.js**: Script used to assign waivers to customers. It refers to `waiverAssign.json`.
  - Run by: `node assignWaiver.js (how many you want to generate)`.

### Testing

- **tests/**: Contains test files for the account type programs to ensure their functionality.

- **coverage/**: Contains files related to test coverage reports.

- **Jenkinsfile**: Configuration file for CI/CD pipeline, used for continuous integration and testing.

- **eslint.config.mjs**: Configuration file for ESLint to ensure code quality and consistency.

### Other

- **data/**: Directory used for storing raw or intermediate data during the data generation process.

- **database/**: Stores all JSON files generated by the program, including customer, employee, and merchandise data.

- **node_modules/**: Contains all the project's dependencies installed via npm.

- **package-lock.json**: Automatically generated file that locks the versions of dependencies installed.

- **package.json**: Contains metadata about the project and its dependencies.

- **README.md**: This file, providing an overview and instructions for the repository.

## Credits

- **Faker.js**: Library used for generating realistic mock data.
- **Axios**: HTTP client for making API requests.

