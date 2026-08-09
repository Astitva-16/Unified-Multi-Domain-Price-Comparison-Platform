const generateMockData = (
  platform,
  query,
  category = "shopping"
) => {

  // =====================================================
  // PRICING
  // =====================================================

  const pricing = {
    Amazon: {
      min: 500,
      max: 2000,
      variance: 50,
    },

    Flipkart: {
      min: 450,
      max: 1900,
      variance: 60,
    },

    Myntra: {
      min: 600,
      max: 2500,
      variance: 70,
    },
  };


  const range =
    pricing[platform.name] || {
      min: 400,
      max: 3000,
      variance: 100,
    };


  const basePrice = Math.floor(
    Math.random() *
      (range.max - range.min) +
      range.min
  );


  const price =
    basePrice +
    (Math.random() - 0.5) *
      range.variance;


  // =====================================================
  // PRODUCT IMAGE
  // =====================================================

  const getProductImage = (query) => {

    const q = String(query)
      .toLowerCase()
      .trim();


    // Wireless Earbuds
    if (
      q.includes("wireless earbuds") ||
      q.includes("earbuds") ||
      q.includes("ear bud") ||
      q.includes("earphones")
    ) {
      return "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop";
    }


    // Smart Watch
    if (
      q.includes("smart watch") ||
      q.includes("smartwatch") ||
      q.includes("watch")
    ) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop";
    }


    // Running Shoes
    if (
      q.includes("running shoes") ||
      q.includes("running shoe") ||
      q.includes("shoes") ||
      q.includes("sneakers")
    ) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop";
    }


    // T-Shirt
    if (
      q.includes("cotton") ||
      q.includes("t shirt") ||
      q.includes("t-shirt") ||
      q.includes("shirt")
    ) {
      return "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop";
    }


    // Laptop
    if (
      q.includes("laptop") ||
      q.includes("notebook")
    ) {
      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop";
    }


    // Smartphone
    if (
      q.includes("smartphone") ||
      q.includes("mobile phone") ||
      q.includes("phone") ||
      q.includes("mobile")
    ) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop";
    }


    // Electronics fallback
    return "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop";
  };


  // Get image for current query
  const image = getProductImage(query);


  // =====================================================
  // RETURN MOCK PRODUCT
  // =====================================================

  return {

    id:
      Math.random()
        .toString(36)
        .substring(2, 11),


    name:
      `${query} - Premium Edition`,


    price:
      Math.floor(price),


    currency:
      "INR",


    platform_id:
      platform.id,


    platform_name:
      platform.name,


    platform_url:
      `${platform.base_url || ""}/search?q=${encodeURIComponent(query)}`,


    rating:
      Number(
        (
          Math.random() * 2 + 3
        ).toFixed(1)
      ),


    reviews:
      Math.floor(
        Math.random() * 5000
      ),


    in_stock:
      Math.random() > 0.2,


    discount_percent:
      Math.floor(
        Math.random() * 30
      ),


    delivery_days:
      Math.floor(
        Math.random() * 5
      ) + 1,


    image,


    category:
      category ||
      platform.category ||
      "shopping",


    fetched_at:
      new Date().toISOString(),
  };
};


// =====================================================
// AMAZON
// =====================================================

const scrapeAmazon = async (query) => {

  try {

    console.log(
      `[Scraper] Would scrape Amazon for: ${query}`
    );


    return generateMockData(
      {
        id: 1,
        name: "Amazon",
        base_url: "https://amazon.in",
        category: "shopping",
      },
      query
    );

  } catch (error) {

    console.error(
      "Amazon scrape failed:",
      error.message
    );

    return null;
  }
};


// =====================================================
// FLIPKART
// =====================================================

const scrapeFlipkart = async (query) => {

  try {

    console.log(
      `[Scraper] Would scrape Flipkart for: ${query}`
    );


    return generateMockData(
      {
        id: 2,
        name: "Flipkart",
        base_url: "https://flipkart.com",
        category: "shopping",
      },
      query
    );

  } catch (error) {

    console.error(
      "Flipkart scrape failed:",
      error.message
    );

    return null;
  }
};


// =====================================================
// MYNTRA
// =====================================================

const scrapeMyntra = async (query) => {

  try {

    console.log(
      `[Scraper] Would scrape Myntra for: ${query}`
    );


    return generateMockData(
      {
        id: 3,
        name: "Myntra",
        base_url: "https://myntra.com",
        category: "shopping",
      },
      query
    );

  } catch (error) {

    console.error(
      "Myntra scrape failed:",
      error.message
    );

    return null;
  }
};


// =====================================================
// FETCH FROM ALL PLATFORMS
// =====================================================

const fetchFromAllPlatforms = async (
  query,
  platforms,
  category = "shopping"
) => {

  try {

    const fetchPromises =
      platforms.map((platform) => {

        return Promise.resolve(
          generateMockData(
            platform,
            query,
            category
          )
        );

      });


    const results =
      await Promise.all(
        fetchPromises
      );


    return results.filter(
      (result) => result !== null
    );

  } catch (error) {

    console.error(
      "Fetch platforms error:",
      error.message
    );

    return [];
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  fetchFromAllPlatforms,

  generateMockData,

  scrapeAmazon,

  scrapeFlipkart,

  scrapeMyntra,

};