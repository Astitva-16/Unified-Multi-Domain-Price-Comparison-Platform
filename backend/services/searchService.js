const fetcherService = require('./fetcherService');
const normalizationService = require('./normalizationService');
const matchingService = require('./matchingService');
const comparisonService = require('./comparisonService');
const cacheService = require('./cacheService');

const mockPlatforms = [
  { id: 1, name: 'Amazon', base_url: 'https://amazon.in' },
  { id: 2, name: 'Flipkart', base_url: 'https://flipkart.com' },
  { id: 3, name: 'Myntra', base_url: 'https://myntra.com' }
];

const searchAndCompare = async (query, category, supabase) => {
  try {
    if (!query) {
      return { error: 'Query is required' };
    }

    console.log('\n📍 Searching for: "' + query + '"');
    const cached = cacheService.get(query, category);
    if (cached) {
      return { ...cached, from_cache: true };
    }

    let platforms = mockPlatforms;

    if (supabase) {
      try {
        const { data, error } = await supabase.from('platforms').select('*');
        if (!error && data && data.length > 0) {
          platforms = data;
        }
      } catch (err) {
        console.log('Using mock platforms');
      }
    }

    console.log(`📱 Platforms: ${platforms.map(p => p.name).join(', ')}`);

    console.log('⏳ Fetching data from platforms...');
    const rawProducts = await fetcherService.fetchFromAllPlatforms(query, platforms);

    console.log('🔄 Normalizing data...');
    const normalizedProducts = rawProducts.map((product, index) => {
      const platformName = platforms[Math.floor(index / Math.ceil(rawProducts.length / platforms.length))]?.name || 'Unknown';
      return normalizationService.normalizeProduct(product, platformName);
    }).filter(p => p !== null);

    if (normalizedProducts.length === 0) {
      return {
        query,
        category: category || 'shopping',
        total_results: 0,
        results: [],
        message: 'No products found'
      };
    }

    console.log('🔍 Matching similar products...');
    const productGroups = matchingService.groupSimilarProducts(normalizedProducts);
    let formattedGroups = matchingService.formatProductGroups(productGroups);

    console.log('📊 Analyzing value and generating recommendations...');
    formattedGroups = formattedGroups.map(product => {
      const analysis = comparisonService.analyzeValue(product.variants);
      const savings = comparisonService.calculateSavings(product.variants);
      const comparison = comparisonService.generateComparison(product);

      return {
        ...product,
        value_analysis: analysis.analysis, // Best value, quality, deal, etc.
        recommendations: analysis.recommendations,
        scored_variants: analysis.scored_products,
        savings_analysis: savings,
        comparison_summary: comparison
      };
    });

    const sorted = formattedGroups.sort((a, b) => {
      const scoreA = parseFloat(a.scored_variants?.[0]?.scores?.overall || 50);
      const scoreB = parseFloat(b.scored_variants?.[0]?.scores?.overall || 50);
      return scoreB - scoreA;
    });

    const priceStats = normalizationService.calculatePriceStats(normalizedProducts);

    const result = {
      query,
      category: category || 'shopping',
      timestamp: new Date().toISOString(),
      total_unique_products: sorted.length,
      total_variants: normalizedProducts.length,
      price_statistics: priceStats,
      results: sorted,
      from_cache: false,
      cache_info: `Results will be cached for 30 minutes`
    };

    console.log('💾 Caching results...');
    cacheService.set(query, category, null, result);

    console.log(`✅ Found ${sorted.length} unique products (${new Set(normalizedProducts.map(p => p.platform_name)).size} platforms)`);

    return result;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};


const batchSearch = async (queries, supabase) => {
  const results = await Promise.all(
    queries.map(q => searchAndCompare(q, 'shopping', supabase))
  );
  return results;
};


const getCacheStats = () => {
  return cacheService.getStats();
};

module.exports = { 
  searchAndCompare,
  batchSearch,
  getCacheStats
};