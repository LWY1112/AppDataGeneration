const { faker } = require('@faker-js/faker/locale/en');

const categoryDescriptions = {
  'Books': 'Discover a wide range of books from various genres and authors.',
  'Movies': 'Explore the latest blockbusters, classic films, and everything in between.',
  'Music': 'Find your favorite music albums and new releases across all genres.',
  'Games': 'Shop for the latest video games, board games, and gaming accessories.',
  'Electronics': 'Browse the newest electronics, gadgets, and accessories.',
  'Computers': 'Find the best deals on laptops, desktops, and computer accessories.',
  'Home': 'Discover home decor, furniture, and kitchen essentials.',
  'Garden': 'Explore gardening tools, outdoor furniture, and plants.',
  'Tools': 'Shop for power tools, hand tools, and tool accessories.',
  'Grocery': 'Get fresh groceries, organic products, and pantry staples.',
  'Health': 'Find health and wellness products, supplements, and personal care items.',
  'Beauty': 'Explore beauty products, skincare, and makeup essentials.',
  'Clothing': 'Discover the latest fashion trends and clothing essentials.',
  'Shoes': 'Find your perfect pair of shoes from a wide selection of styles.',
  'Jewelry': 'Shop for fine jewelry, watches, and accessories.',
  'Toys': 'Find toys for all ages, from educational to fun and games.',
  'Baby': 'Shop for baby essentials, clothing, and accessories.',
  'Automotive': 'Browse car accessories, parts, and tools.',
  'Industrial': 'Discover industrial supplies, equipment, and safety products.',
  'Sports': 'Find sports equipment, apparel, and accessories.',
  'Outdoors': 'Shop for outdoor gear, camping equipment, and adventure essentials.',
  'Office': 'Explore office supplies, furniture, and equipment.',
  'Pet Supplies': 'Find everything you need for your pets, from food to accessories.'
};

let sequenceCounter = 1;
const usedCategories = new Set();

function generateRandomProduct() {
  const categories = Object.keys(categoryDescriptions);
  let category;
  
  // Find a unique category
  for (const cat of categories) {
    if (!usedCategories.has(cat)) {
      category = cat;
      usedCategories.add(cat);
      break;
    }
  }
  
  if (!category) {
    throw new Error('No more unique categories available');
  }

  const description = categoryDescriptions[category];
  const sequence = sequenceCounter++;
  const types = ['MERCHANDISE', 'RENTAL'];

  // Determine the number of types (1 to the total number of available types)
  const numberOfTypes = Math.floor(Math.random() * types.length) + 1;

  // Select the types
  const selectedTypes = [];
  while (selectedTypes.length < numberOfTypes) {
    const type = faker.helpers.arrayElement(types);
    if (!selectedTypes.includes(type)) {
      selectedTypes.push(type);
    }
  }

  // Determine the number of images to generate (1 to 5)
  const numberOfImages = Math.floor(Math.random() * 5) + 1;
  const images = [];
  for (let i = 0; i < numberOfImages; i++) {
    const imageUrl = faker.image.urlLoremFlickr({ category, width: 640, height: 480 });
    images.push(imageUrl);
  }

  return {
    name: category,
    desc: description,
    images: images,
    sequence: sequence,
    type: selectedTypes,
    enable: faker.datatype.boolean()
  };
}

module.exports = { generateRandomProduct };
