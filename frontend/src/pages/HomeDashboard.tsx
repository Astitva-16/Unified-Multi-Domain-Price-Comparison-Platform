import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { categories, deals, products, suggestions, priceRanges } from "@/data/mockData";
import { useStore } from "@/store/useStore";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

const HomeDashboard = () => {
  const { selectedCategory, setSelectedCategory, setSearchQuery } = useStore();
  const navigate = useNavigate();
  const [bannerIdx, setBannerIdx] = useState(0);

  // Auto-scroll banner
  useState(() => {
    const interval = setInterval(() => setBannerIdx((i) => (i + 1) % deals.length), 3000);
    return () => clearInterval(interval);
  });

  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
    navigate(`/search?category=${id}`);
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Banner Carousel */}
      <section className="relative overflow-hidden">
        <div className="relative h-48 md:h-72">
          {deals.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={false}
              animate={{ opacity: i === bannerIdx ? 1 : 0, scale: i === bannerIdx ? 1 : 0.95 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 bg-gradient-to-r ${deal.gradient} flex items-center justify-center text-primary-foreground p-8 ${i === bannerIdx ? "z-10" : "z-0"}`}
            >
              <div className="text-center">
                {deal.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-card/20 text-xs font-bold mb-3">{deal.badge}</span>
                )}
                <h2 className="text-2xl md:text-4xl font-bold">{deal.title}</h2>
                <p className="text-sm md:text-lg opacity-90 mt-2">{deal.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {deals.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === bannerIdx ? "bg-card w-6" : "bg-card/50"}`}
            />
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Category Selection */}
        <section>
          <h2 className="text-xl font-bold mb-1">What are you searching for?</h2>
          <p className="text-muted-foreground text-sm mb-4">Select a category to start comparing</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.slice(0, 6).map((cat, i) => (
              <motion.button
                key={cat.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  selectedCategory === cat.id
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "bg-card hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <span className="text-2xl block mb-1">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Smart Suggestions */}
        {(Object.entries(suggestions) as [string, string[]][]).map(([key, items]) => (
          <section key={key}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold capitalize">{key} Suggestions</h3>
              <button className="text-sm text-primary flex items-center gap-1 hover:underline">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {items.map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex-shrink-0 px-5 py-3 rounded-xl bg-card border hover:border-primary/30 hover:shadow-md transition-all text-sm font-medium"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </section>
        ))}

        {/* Price Ranges */}
        <section>
          <h3 className="font-semibold mb-3">Shop by Budget</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {priceRanges.map((pr) => (
              <motion.button
                key={pr.value}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => { setSearchQuery(`under ₹${pr.value}`); navigate(`/search?maxPrice=${pr.value}`); }}
                className="p-4 rounded-xl bg-card border text-center hover:border-primary/30 hover:shadow-md transition-all"
              >
                <span className="font-bold text-primary">{pr.label}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Category Showcase */}
        <section>
          <h3 className="font-semibold mb-4">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/category/${cat.id}`}
                  className="block rounded-2xl overflow-hidden bg-card border hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-medium">{cat.icon} {cat.name}</p>
                    <p className="text-xs text-muted-foreground">{cat.count.toLocaleString()} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Trending Deals</h3>
            <Link to="/search" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product, i) => {
              const lowest = Math.min(...product.prices.map((p) => p.price));
              return (
                <motion.div
                  key={product.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    to={`/compare/${product.id}`}
                    className="block rounded-2xl overflow-hidden bg-card border hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-bold text-primary">₹{lowest}</span>
                        <span className="text-xs text-muted-foreground">from {product.prices.length} platforms</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-3 text-xs">Compare Prices</Button>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeDashboard;
