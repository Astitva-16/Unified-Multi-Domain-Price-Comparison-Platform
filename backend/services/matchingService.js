
const jaccardSimilarity = (str1, str2) => {
  const set1 = new Set(str1.split(' ').filter(w => w));
  const set2 = new Set(str2.split(' ').filter(w => w));

  let intersection = 0;
  set1.forEach(item => {
    if (set2.has(item)) intersection++;
  });

  const union = set1.size + set2.size - intersection;
  if (union === 0) return 0;
  
  return (intersection / union) * 100;
};


const isPriceProximate = (price1, price2, tolerance = 0.2) => {
  if (price1 === 0 || price2 === 0) return true; // Ignore zero prices
  
  const difference = Math.abs(price1 - price2) / Math.max(price1, price2);
  return difference <= tolerance;
};


const matchProduct = (product1, product2) => {
  const nameSimilarity = jaccardSimilarity(
    product1.normalized_name,
    product2.normalized_name
  );

  const priceProximate = isPriceProximate(product1.price, product2.price) ? 100 : 0;

  const ratingDiff = Math.abs(product1.rating - product2.rating);
  const ratingSimilarity = Math.max(0, 100 - (ratingDiff * 10));

  const confidence = 
    (nameSimilarity * 0.6) +
    (priceProximate * 0.3) +
    (ratingSimilarity * 0.1);

  return {
    product1_id: product1.id,
    product2_id: product2.id,
    product1_name: product1.name,
    product2_name: product2.name,
    product1_platform: product1.platform_name,
    product2_platform: product2.platform_name,
    name_similarity: nameSimilarity.toFixed(1),
    price_proximity: priceProximate,
    confidence: confidence.toFixed(1),
    is_match: confidence > 70 
  };
};


const groupSimilarProducts = (products) => {
  const groups = [];
  const used = new Set();

  for (let i = 0; i < products.length; i++) {
    if (used.has(i)) continue;

    const group = [products[i]];
    used.add(i);

    for (let j = i + 1; j < products.length; j++) {
      if (used.has(j)) continue;

      const match = matchProduct(products[i], products[j]);
      if (match.is_match) {
        group.push(products[j]);
        used.add(j);
      }
    }

    groups.push(group);
  }

  return groups;
};


const formatProductGroups = (groups) => {
  return groups.map(group => {
    const bestProduct = group.sort((a, b) => b.rating - a.rating)[0];
    const cheapest = group.sort((a, b) => a.price - b.price)[0];
    const mostExpensive = group.sort((a, b) => b.price - a.price)[0];

    return {
      product_name: bestProduct.name,
      normalized_name: bestProduct.normalized_name,
      category: bestProduct.category || 'shopping',
      variants: group,
      best_rating: Math.max(...group.map(p => p.rating)),
      price_range: {
        min: cheapest.price,
        max: mostExpensive.price,
        difference: mostExpensive.price - cheapest.price,
        best_deal: cheapest.platform_name
      },
      platforms_count: group.length,
      average_rating: (group.reduce((sum, p) => sum + p.rating, 0) / group.length).toFixed(1)
    };
  });
};

module.exports = {
  jaccardSimilarity,
  isPriceProximate,
  matchProduct,
  groupSimilarProducts,
  formatProductGroups
};