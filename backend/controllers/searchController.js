const searchService = require('../services/searchService');

const searchProducts = async (req, res) => {
  try {
    const { query, category } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await searchService.searchAndCompare(query, category, req.supabase);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = { searchProducts };