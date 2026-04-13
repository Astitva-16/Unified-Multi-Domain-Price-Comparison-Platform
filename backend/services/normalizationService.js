const PRODUCT_SCHEMA = {
  id: '',
  name: '',
  image: '',
  price: 0,
  currency: 'INR',
  platform_name: '',
  platform_url: '',
  rating: 0,
  review_count: 0,
  in_stock: true,
  discount_percent: 0,
  delivery_days: 5,
  normalized_name: '', // For matching
  category: '',
  fetched_at: new Date().toISOString()
};


const normalizeProduct = (rawProduct, platformName) => {
  try {
    const normalized = {
      ...PRODUCT_SCHEMA,
      id: rawProduct.id || Math.random().toString(36).substr(2, 9),
      name: String(rawProduct.name || rawProduct.product_name || '').trim(),
      image: rawProduct.image || rawProduct.product_image || rawProduct.image_url || '',
      price: parseInt(rawProduct.price || 0, 10),
      currency: rawProduct.currency || 'INR',
      platform_name: platformName,
      platform_url: rawProduct.platform_url || '',
      rating: parseFloat(rawProduct.rating || 0),
      review_count: parseInt(rawProduct.reviews || rawProduct.review_count || 0, 10),
      in_stock: rawProduct.in_stock !== false,
      discount_percent: parseInt(rawProduct.discount_percent || 0, 10),
      delivery_days: parseInt(rawProduct.delivery_days || 5, 10),
      category: rawProduct.category || '',
      fetched_at: rawProduct.fetched_at || new Date().toISOString()
    };

    normalized.normalized_name = normalizeText(normalized.name);

    return normalized;
  } catch (error) {
    console.error('Normalization error:', error);
    return null;
  }
};


const normalizeText = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') 
    .replace(/\s+/g, ' ') 
    .trim()
    .split(' ')
    .filter(word => !isCommonWord(word)) 
    .join(' ');
};


const isCommonWord = (word) => {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'for', 'with', 'in', 'by', 'to', 'of'];
  return stopWords.includes(word) || word.length < 2;
};


const normalizeProducts = (products, platformName) => {
  return products
    .map(product => normalizeProduct(product, platformName))
    .filter(p => p !== null);
};


const calculatePriceStats = (products) => {
  if (!products || products.length === 0) {
    return { min: 0, max: 0, avg: 0, median: 0 };
  }

  const prices = products.map(p => p.price).sort((a, b) => a - b);
  const min = prices[0];
  const max = prices[prices.length - 1];
  const avg = Math.floor(prices.reduce((a, b) => a + b, 0) / prices.length);
  const median = prices[Math.floor(prices.length / 2)];

  return { min, max, avg, median };
};

module.exports = {
  normalizeProduct,
  normalizeProducts,
  normalizeText,
  calculatePriceStats,
  PRODUCT_SCHEMA
};