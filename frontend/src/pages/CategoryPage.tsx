import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories, products } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CategoryPage = () => {
  const { id } = useParams();
  const category = categories.find((c) => c.id === id);
  const categoryProducts = products.filter((p) => p.category === id);
  const displayProducts = categoryProducts.length ? categoryProducts : products;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/home" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          {category?.icon} {category?.name || "Category"}
        </h1>
        <p className="text-muted-foreground mt-1">{category?.count.toLocaleString()} items available</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product, i) => {
          const lowest = Math.min(...product.prices.map((p) => p.price));
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Link
                to={`/compare/${product.id}`}
                className="block rounded-2xl overflow-hidden bg-card border hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <p className="font-medium line-clamp-2">{product.name}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-bold text-primary">₹{lowest}</span>
                    <span className="text-xs text-muted-foreground">across {product.prices.length} platforms</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {product.prices.map((p) => (
                      <span key={p.platform} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {p.platform}
                      </span>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3 text-xs">Compare Prices</Button>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
