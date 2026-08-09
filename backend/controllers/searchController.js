const searchService = require('../services/searchService');


/* =====================================================
   SEARCH PRODUCTS
===================================================== */

const searchProducts = async (req, res) => {

  try {

    const { query, category } = req.query;


    if (!query) {

      return res.status(400).json({
        error: 'Query parameter is required'
      });

    }


    const results =
      await searchService.searchAndCompare(
        query,
        category
      );


    res.json(results);

  } catch (error) {

    console.error(
      'Search error:',
      error
    );


    res.status(500).json({

      error:
        'Internal server error',

      message:
        error.message

    });

  }

};


/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

const getProductById = (req, res) => {

  try {

    const { id } = req.params;


    if (!id) {

      return res.status(400).json({
        error: 'Product id is required'
      });

    }


    const product =
      searchService.findProductById(id);


    if (!product) {

      return res.status(404).json({
        error:
          'Product not found in cache'
      });

    }


    res.json(product);

  } catch (error) {

    console.error(
      'Product lookup error:',
      error
    );


    res.status(500).json({

      error:
        'Internal server error',

      message:
        error.message

    });

  }

};


/* =====================================================
   TRENDING PRODUCTS
===================================================== */

const getTrendingProducts = async (
  req,
  res
) => {

  try {

    /*
      These are the products/categories
      that will appear on the Mol Bhao
      homepage.
    */

    const trendingQueries = [

      'wireless earbuds',

      'smart watch',

      'running shoes',

      'cotton t shirt',

      'laptop',

      'smartphone'

    ];


    /*
      Search all products in parallel.
    */

    const results =
      await Promise.all(

        trendingQueries.map(
          (query) =>
            searchService.searchAndCompare(
              query,
              'shopping'
            )
        )

      );


    /*
      Every search response contains
      a `results` array.

      Combine all of them into
      one array.
    */

    const products =
      results.flatMap(
        (result) =>
          result.results || []
      );


    res.json({

      success: true,

      products

    });

  } catch (error) {

    console.error(
      'Trending products error:',
      error
    );


    res.status(500).json({

      success: false,

      error:
        'Unable to load trending products',

      message:
        error.message

    });

  }

};


/* =====================================================
   EXPORTS
===================================================== */

module.exports = {

  searchProducts,

  getProductById,

  getTrendingProducts

};