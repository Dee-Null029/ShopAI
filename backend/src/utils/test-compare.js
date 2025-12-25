const compare = require('./compare');

const sample = [
  { name: 'A', platform: 'Amazon', price: 1000, rating: 4.5, productUrl: 'http://a' },
  { name: 'B', platform: 'Flipkart', price: 900, rating: 4.2, productUrl: 'http://b' },
  { name: 'C', platform: 'Amazon', price: 1100, rating: 4.8, productUrl: 'http://c' },
  { name: 'D', platform: 'Flipkart', price: 950, rating: 4.0, productUrl: 'http://d' }
];

console.log(JSON.stringify(compare(sample, { topN: 3 }), null, 2));
