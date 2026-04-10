const detectOutliers = (products) => {
  if (products.length < 4) return products; // Need samples for quartiles

  const prices = products.map(p => p.price).sort((a, b) => a - b);
  
  const q1Index = Math.floor(prices.length * 0.25);
  const q3Index = Math.floor(prices.length * 0.75);
  
  const q1 = prices[q1Index];
  const q3 = prices[q3Index];
  const iqr = q3 - q1;
  
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return products.map(product => ({
    ...product,
    is_outlier: product.price < lowerBound || product.price > upperBound,
    outlier_reason: product.price < lowerBound 
      ? 'Unusually cheap - verify authenticity'
      : product.price > upperBound 
        ? 'Unusually expensive - compare with similar products'
        : null
  }));
};


const scoreProducts = (products) => {
  if (products.length === 0) return [];

  // Get min/max for each factor (for normalization)
  const prices = products.map(p => p.price);
  const ratings = products.map(p => p.rating);
  const discounts = products.map(p => p.discount_percent);
  const deliveries = products.map(p => p.delivery_days);

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minRating = Math.min(...ratings);
  const maxRating = Math.max(...ratings);
  const maxDiscount = Math.max(...discounts);
  const minDelivery = Math.min(...deliveries);
  const maxDelivery = Math.max(...deliveries);

  
  const normalize = (value, min, max) => {
    if (min === max) return 50; // Avoid division by zero
    return ((value - min) / (max - min)) * 100;
  };

  
  return products.map(product => {
    const priceScore = 100 - normalize(product.price, minPrice, maxPrice);
    const ratingScore = normalize(product.rating, minRating, maxRating);
    const discountScore = normalize(product.discount_percent, 0, maxDiscount);
    const deliveryScore = 100 - normalize(product.delivery_days, minDelivery, maxDelivery);

    const overallScore = 
      (priceScore * 0.40) +
      (ratingScore * 0.30) +
      (discountScore * 0.20) +
      (deliveryScore * 0.10);

    return {
      ...product,
      scores: {
        price: priceScore.toFixed(1),
        rating: ratingScore.toFixed(1),
        discount: discountScore.toFixed(1),
        delivery: deliveryScore.toFixed(1),
        overall: overallScore.toFixed(1)
      }
    };
  });
};


const analyzeValue = (products) => {
  if (products.length === 0) return { analysis: {}, recommendations: [] };

  const scoredProducts = scoreProducts(detectOutliers(products));

  const analysis = {
    best_value: scoredProducts.reduce((max, p) => 
      parseFloat(p.scores.overall) > parseFloat(max.scores.overall) ? p : max
    ),
    best_quality: scoredProducts.reduce((max, p) => 
      p.rating > max.rating ? p : max
    ),
    cheapest: scoredProducts.reduce((min, p) => 
      p.price < min.price ? p : min
    ),
    best_discount: scoredProducts.reduce((max, p) => 
      p.discount_percent > max.discount_percent ? p : max
    ),
    fastest_delivery: scoredProducts.reduce((min, p) => 
      p.delivery_days < min.delivery_days ? p : min
    )
  };

  const uniqueRecommendations = Array.from(new Map(
    Object.entries(analysis).map(([key, product]) => [product.id, { type: key, product }])
  ).values());

  return {
    analysis,
    recommendations: uniqueRecommendations,
    scored_products: scoredProducts
  };
};

const calculateSavings = (products) => {
  if (products.length < 2) return { savings: 0, savings_percent: 0 };

  const prices = products.map(p => p.price).sort((a, b) => a - b);
  const bestPrice = prices[0];
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  return {
    best_price: bestPrice,
    average_price: Math.floor(averagePrice),
    savings: Math.floor(averagePrice - bestPrice),
    savings_percent: Math.floor(((averagePrice - bestPrice) / averagePrice) * 100)
  };
};


const generateComparison = (product) => {
  if (!product.variants || product.variants.length < 2) {
    return 'This product is available on only one platform.';
  }

  const variants = product.variants.sort((a, b) => a.price - b.price);
  const cheapest = variants[0];
  const mostPopular = variants.reduce((a, b) => 
    b.review_count > a.review_count ? b : a
  );

  const priceDiff = variants[variants.length - 1].price - cheapest.price;
  const ratingDiff = (cheapest.rating - mostPopular.rating).toFixed(1);

  return {
    summary: `${cheapest.platform_name} has the lowest price (₹${cheapest.price}), saving ₹${priceDiff} vs highest. ${cheapest.platform_name} rates ${cheapest.rating}, ${ratingDiff}${Math.sign(ratingDiff) < 0 ? ' lower' : ' higher'} than ${mostPopular.platform_name}.`,
    best_price_platform: cheapest.platform_name,
    best_quality_platform: mostPopular.platform_name,
    savings_amount: priceDiff
  };
};

module.exports = {
  detectOutliers,
  scoreProducts,
  analyzeValue,
  calculateSavings,
  generateComparison
};