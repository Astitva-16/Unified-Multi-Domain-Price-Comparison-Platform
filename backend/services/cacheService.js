class SearchCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 30 * 60 * 1000; // 30 minutes in milliseconds
  }

  
  generateKey(query, category, filters) {
    const filterStr = filters ? JSON.stringify(filters) : '';
    return `${query}:${category || 'default'}:${filterStr}`;
  }

  
  get(query, category, filters) {
    const key = this.generateKey(query, category, filters);
    const cached = this.cache.get(key);

    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache HIT for: ${key}`);
    return cached.data;
  }

  
  set(query, category, filters, data) {
    const key = this.generateKey(query, category, filters);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    console.log(`💾 Cached: ${key}`);
  }

  invalidate(query, category) {
    const keyPattern = `${query}:${category || 'default'}`;
    for (const [key] of this.cache) {
      if (key.startsWith(keyPattern)) {
        this.cache.delete(key);
        console.log(`🗑️ Invalidated: ${key}`);
      }
    }
  }


  clear() {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cleared cache (${size} entries)`);
  }

  getStats() {
    let totalSize = 0;
    const entries = [];

    for (const [key, value] of this.cache) {
      const size = JSON.stringify(value.data).length;
      totalSize += size;
      entries.push({
        key,
        size: `${(size / 1024).toFixed(2)} KB`,
        age: `${((Date.now() - value.timestamp) / 1000 / 60).toFixed(1)} min`
      });
    }

    return {
      total_entries: this.cache.size,
      total_size: `${(totalSize / 1024).toFixed(2)} KB`,
      entries
    };
  }
}

const cacheInstance = new SearchCache();

module.exports = cacheInstance;
module.exports.SearchCache = SearchCache;