const searchService = require('../services/searchService');

const searchProducts = async (req, res) => {
  try {
    const { query, category } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await searchService.searchAndCompare(query, category);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

const getProductById = (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Product id is required' });
    }

    const product = searchService.findProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found in cache' });
    }

    res.json(product);
  } catch (error) {
    console.error('Product lookup error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = { searchProducts, getProductById };