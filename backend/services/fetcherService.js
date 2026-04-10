const axios = require('axios');


const generateMockData = (platform, query) => {
  const pricing = {
    'Amazon': { min: 500, max: 2000, variance: 50 },
    'Flipkart': { min: 450, max: 1900, variance: 60 },
    'Myntra': { min: 600, max: 2500, variance: 70 }
  };

  const range = pricing[platform.name] || { min: 400, max: 3000, variance: 100 };
  const basePrice = Math.floor(Math.random() * (range.max - range.min) + range.min);
  const price = basePrice + (Math.random() - 0.5) * range.variance;

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${query} - Premium Edition`,
    price: Math.floor(price),
    currency: 'INR',
    platform_id: platform.id,
    platform_name: platform.name,
    platform_url: `${platform.base_url}/search?q=${query}`,
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviews: Math.floor(Math.random() * 5000),
    in_stock: Math.random() > 0.2,
    discount_percent: Math.floor(Math.random() * 30),
    delivery_days: Math.floor(Math.random() * 5) + 1,
    fetched_at: new Date().toISOString()
  };
};

const scrapeAmazon = async (query) => {
  try {
    console.log(`[Scraper] Would scrape Amazon for: ${query}`);
    return generateMockData({ id: 1, name: 'Amazon' }, query);
  } catch (error) {
    console.error('Amazon scrape failed:', error.message);
    return null;
  }
};

const scrapeFlipkart = async (query) => {
  try {
    console.log(`[Scraper] Would scrape Flipkart for: ${query}`);
    return generateMockData({ id: 2, name: 'Flipkart', base_url: 'https://flipkart.com' }, query);
  } catch (error) {
    console.error('Flipkart scrape failed:', error.message);
    return null;
  }
};

const scrapeMyntra = async (query) => {
  try {
    console.log(`[Scraper] Would scrape Myntra for: ${query}`);
    return generateMockData({ id: 3, name: 'Myntra', base_url: 'https://myntra.com' }, query);
  } catch (error) {
    console.error('Myntra scrape failed:', error.message);
    return null;
  }
};

const fetchFromAllPlatforms = async (query, platforms) => {
  const fetchPromises = platforms.map(platform => {
    return Promise.resolve(generateMockData(platform, query));
  });

  const results = await Promise.all(fetchPromises);
  return results.filter(r => r !== null); 
};

module.exports = {
  fetchFromAllPlatforms,
  generateMockData,
  scrapeAmazon,
  scrapeFlipkart,
  scrapeMyntra
};