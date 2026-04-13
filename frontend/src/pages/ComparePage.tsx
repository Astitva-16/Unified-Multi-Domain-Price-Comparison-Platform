import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Star, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortKey = "price" | "rating" | "delivery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

const fetchProduct = async (id: string | undefined) => {
  if (!id) throw new Error('Missing product id');
  const response = await fetch(`${API_BASE_URL}/product/${encodeURIComponent(id)}`);
  if (!response.ok) {
    throw new Error('Product not found');
  }
  return response.json();
};

const ComparePage = () => {
  const { id } = useParams();
  const [sortBy, setSortBy] = useState<SortKey>("price");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Could not load product details.</div>
      </div>
    );
  }

  const sorted = [...(product.variants || [])].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const lowest = product.variants?.length ? Math.min(...product.variants.map((p) => p.price || 0)) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft size={16} /> Back to results
      </Link>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        {/* Product info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover rounded-2xl border" />
          <h1 className="text-xl font-bold mt-4">{product.name}</h1>
          <p className="text-muted-foreground text-sm capitalize mt-1">{product.category}</p>
          <p className="text-2xl font-bold text-primary mt-2">From ₹{lowest}</p>
          <p className="text-xs text-muted-foreground">Compared across {product.variants?.length || 0} platforms</p>
        </motion.div>

        {/* Comparison table */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            {(["price", "rating", "delivery"] as SortKey[]).map((key) => (
              <Button
                key={key}
                size="sm"
                variant={sortBy === key ? "default" : "outline"}
                onClick={() => setSortBy(key)}
                className={`capitalize text-xs ${sortBy === key ? "gradient-primary text-primary-foreground border-0" : ""}`}
              >
                {key === "price" ? "Lowest Price" : key === "rating" ? "Highest Rating" : "Fastest Delivery"}
              </Button>
            ))}
          </div>

          <div className="rounded-2xl border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary">
                  <th className="text-left p-4 text-sm font-semibold">Platform</th>
                  <th className="text-left p-4 text-sm font-semibold">Price</th>
                  <th className="text-left p-4 text-sm font-semibold hidden sm:table-cell">Discount</th>
                  <th className="text-left p-4 text-sm font-semibold hidden sm:table-cell">Delivery</th>
                  <th className="text-left p-4 text-sm font-semibold">Rating</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <motion.tr
                    key={p.platform}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`border-t ${p.price === lowest ? "bg-success/5" : ""}`}
                  >
                    <td className="p-4 font-medium">{p.platform_name || p.platform}</td>
                    <td className={`p-4 font-bold ${p.price === lowest ? "text-success" : ""}`}>
                      ₹{p.price}
                      {p.price === lowest && <span className="ml-2 text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">Lowest</span>}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">{p.discount || p.discount_percent ? `${p.discount || p.discount_percent + '% off'}` : "—"}</td>
                    <td className="p-4 text-sm hidden sm:table-cell">{p.delivery || (p.delivery_days ? `${p.delivery_days} days` : 'N/A')}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-warning text-warning" />
                        <span className="text-sm font-medium">{p.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="outline" className="gap-1 text-xs">
                        Buy <ExternalLink size={12} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ComparePage;
