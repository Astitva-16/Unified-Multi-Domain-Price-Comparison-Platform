import { FormEvent, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Star, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const searchProducts = async (query: string, category?: string) => {
  const params = new URLSearchParams({ query });
  if (category) params.set('category', category);
  const response = await fetch(`${API_BASE_URL}/search?${params}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
};

const SearchResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";
  const category = params.get("category") || "shopping";
  const [searchInput, setSearchInput] = useState(query);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query, category],
    queryFn: () => searchProducts(query, category),
    enabled: !!query,
  });

  const results = data?.results || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}&category=${category}`);
    }
  };

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Search in {category.charAt(0).toUpperCase() + category.slice(1)}</h1>
          <p className="text-muted-foreground mb-8">Enter what you're looking for and we'll compare prices across multiple platforms.</p>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="text"
              placeholder={`Search for ${category}...`}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="gradient-primary text-primary-foreground border-0">
              <SearchIcon size={18} />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {query ? `Results for "${query}"` : "All Products"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{results.length} results found</p>
      </div>

      <div className="space-y-4">
        {results.map((product, i) => {
          const variants = product.scored_variants || product.variants || [];
          const lowest = variants.length > 0 ? Math.min(...variants.map((v) => v.price || 0)) : 0;
          return (
            <motion.div
              key={product.id || i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-card border hover:shadow-lg transition-shadow"
            >
              <img
                src={product.image || product.product_image}
                alt={product.name || product.product_name}
                className="w-full sm:w-40 h-40 object-cover rounded-xl"
                loading="lazy"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{product.name || product.product_name}</h3>
                <p className="text-xs text-muted-foreground capitalize mt-1">{product.category || 'shopping'}</p>
                <div className="mt-3 space-y-1.5">
                  {variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-sm px-3 py-1.5 rounded-lg ${
                        variant.price === lowest ? "bg-success/10 border border-success/20" : "bg-secondary"
                      }`}
                    >
                      <span className="font-medium">{variant.platform_name || variant.platform}</span>
                      <div className="flex items-center gap-3">
                        {variant.discount && <span className="text-xs text-success font-medium">{variant.discount}</span>}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star size={10} className="fill-warning text-warning" /> {variant.rating || 4.0}
                        </div>
                        <span className="text-xs text-muted-foreground">{variant.delivery_days ? `${variant.delivery_days} days` : 'N/A'}</span>
                        <span className={`font-bold ${variant.price === lowest ? "text-success" : ""}`}>₹{variant.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to={`/compare/${product.id}`}>
                  <Button size="sm" className="mt-3 gradient-primary text-primary-foreground border-0">Compare Prices</Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResults;
