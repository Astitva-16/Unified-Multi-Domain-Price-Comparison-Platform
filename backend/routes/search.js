const express = require('express');

const router = express.Router();

const searchController = require('../controllers/searchController');
const searchService = require('../services/searchService');


/* =====================================================
   SEARCH PRODUCTS
===================================================== */

router.get(
  '/search',
  searchController.searchProducts
);


/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

router.get(
  '/product/:id',
  searchController.getProductById
);


/* =====================================================
   TRENDING PRODUCTS
===================================================== */

router.get(
  '/trending',
  searchController.getTrendingProducts
);


/* =====================================================
   CACHE STATISTICS
===================================================== */

router.get(
  '/cache-stats',
  (req, res) => {

    try {

      const stats =
        searchService.getCacheStats();

      res.json({

        message:
          'Cache statistics',

        stats

      });

    } catch (error) {

      res.status(500).json({

        error:
          error.message

      });

    }

  }
);


module.exports = router;