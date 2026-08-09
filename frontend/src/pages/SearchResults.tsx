import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Star, Search, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* =====================================================
   API BASE URL
===================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "/api");

/* =====================================================
   SEARCH API
===================================================== */

const searchProducts = async (
  query: string,
  category?: string
) => {
  const params = new URLSearchParams();

  params.set("query", query);

  if (category && category !== "shopping") {
    params.set("category", category);
  }

  const response = await fetch(
    `${API_BASE_URL}/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Search failed");
  }

  return response.json();
};

/* =====================================================
   SEARCH RESULTS
===================================================== */

const SearchResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const query = params.get("q") || "";
  const category = params.get("category") || "shopping";

  const [searchInput, setSearchInput] =
    useState(query);

  /* =====================================================
     REACT QUERY
  ===================================================== */

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["search", query, category],

    queryFn: () =>
      searchProducts(query, category),

    enabled: !!query.trim(),

    staleTime: 30 * 60 * 1000,
  });

  const results = data?.results || [];

  /* =====================================================
     SEARCH HANDLER
  ===================================================== */

  const handleSearch = (
    e: FormEvent
  ) => {
    e.preventDefault();

    const value = searchInput.trim();

    if (!value) return;

    navigate(
      `/search?q=${encodeURIComponent(value)}${
        category
          ? `&category=${encodeURIComponent(category)}`
          : ""
      }`
    );
  };

  /* =====================================================
     NO QUERY
  ===================================================== */

  if (!query.trim()) {
    return (
      <div className="min-h-[70vh] bg-background flex items-center justify-center px-4">

        <div className="w-full max-w-xl bg-card text-card-foreground rounded-xl border border-border p-8 text-center shadow-soft">

          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">

            <Search
              size={26}
              className="text-primary"
            />

          </div>

          <h1 className="text-2xl font-bold text-foreground mt-5">
            Search Products
          </h1>

          <p className="text-muted-foreground mt-2">
            Search for a product and compare
            prices across multiple platforms.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex gap-2 mt-6"
          >

            <Input
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              placeholder="e.g. wireless earbuds"
              className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground"
            />

            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Search size={18} />
            </Button>

          </form>

        </div>

      </div>
    );
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">

        <div className="max-w-[1200px] mx-auto px-4 py-8">

          <div className="animate-pulse">

            <div className="h-8 w-72 bg-muted rounded mb-2" />

            <div className="h-4 w-48 bg-muted rounded mb-8" />

            <div className="space-y-4">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="bg-card rounded-xl border border-border p-5 flex gap-5"
                >

                  <div className="w-40 h-40 bg-muted rounded-xl" />

                  <div className="flex-1 space-y-4">

                    <div className="h-5 bg-muted rounded w-2/3" />

                    <div className="h-4 bg-muted rounded w-1/4" />

                    <div className="h-10 bg-muted rounded" />

                    <div className="h-10 bg-muted rounded" />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">

        <div className="text-center">

          <div className="w-14 h-14 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">

            <Search
              size={26}
              className="text-destructive"
            />

          </div>

          <h1 className="text-2xl font-bold text-foreground mt-4">
            Something went wrong
          </h1>

          <p className="text-muted-foreground mt-2">
            We couldn't fetch the products.
          </p>

          <Button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>

        </div>

      </div>
    );
  }

  /* =====================================================
     RESULTS
  ===================================================== */

  return (
    <div className="min-h-screen bg-background text-foreground">

      <div className="max-w-[1200px] mx-auto px-4 py-8">

        {/* ===============================================
            SEARCH BAR
        =============================================== */}

        <form
          onSubmit={handleSearch}
          className="flex gap-2 max-w-2xl mb-8"
        >

          <Input
            value={searchInput}
            onChange={(e) =>
              setSearchInput(e.target.value)
            }
            placeholder="Search products..."
            className="h-11 bg-card border-border text-foreground placeholder:text-muted-foreground"
          />

          <Button
            type="submit"
            className="h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Search size={18} />
          </Button>

        </form>

        {/* ===============================================
            HEADER
        =============================================== */}

        <div className="mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-foreground">

            Results for "{query}"

          </h1>

          <div className="flex items-center gap-3 mt-2">

            <p className="text-sm text-muted-foreground">

              {data?.total_unique_products ??
                results.length}{" "}

              products found

            </p>

            {isFetching && (

              <span className="text-xs text-primary">
                Updating...
              </span>

            )}

          </div>

        </div>

        {/* ===============================================
            EMPTY
        =============================================== */}

        {results.length === 0 && (

          <div className="bg-card text-card-foreground rounded-xl border border-border p-10 text-center shadow-soft">

            <Search
              size={40}
              className="mx-auto text-muted-foreground"
            />

            <h2 className="text-xl font-bold text-foreground mt-4">
              No products found
            </h2>

            <p className="text-muted-foreground mt-2">
              Try searching for another product.
            </p>

          </div>

        )}

        {/* ===============================================
            PRODUCT LIST
        =============================================== */}

        <div className="space-y-5">

          {results.map(
            (
              product: any,
              index: number
            ) => {

              const variants =
                product.scored_variants ||
                product.variants ||
                [];

              const validPrices =
                variants
                  .map((v: any) =>
                    Number(v.price)
                  )
                  .filter(
                    (price: number) =>
                      price > 0
                  );

              const lowest =
                validPrices.length > 0
                  ? Math.min(...validPrices)
                  : 0;

              return (

                <motion.div
                  key={
                    product.id || index
                  }

                  initial={{
                    opacity: 0,
                    y: 15,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: index * 0.05,
                  }}

                  className="bg-card text-card-foreground rounded-xl border border-border p-5 hover:shadow-soft transition-all"
                >

                  <div className="flex flex-col md:flex-row gap-5">

                    {/* ===================================
                        IMAGE
                    ==================================== */}

                    <div className="w-full md:w-44 h-44 flex-shrink-0 bg-muted rounded-lg overflow-hidden">

                      {product.image ? (

                        <img
                          src={product.image}
                          alt={
                            product.product_name ||
                            product.name ||
                            "Product"
                          }
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>

                      )}

                    </div>

                    {/* ===================================
                        CONTENT
                    ==================================== */}

                    <div className="flex-1">

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                        <div>

                          <h2 className="text-lg font-bold text-foreground">

                            {product.product_name ||
                              product.name}

                          </h2>

                          <p className="text-xs text-muted-foreground capitalize mt-1">

                            {product.category ||
                              category}

                          </p>

                        </div>

                        {lowest > 0 && (

                          <div className="text-left sm:text-right">

                            <p className="text-xs text-muted-foreground">
                              Best price
                            </p>

                            <p className="text-2xl font-bold text-success">
                              ₹
                              {lowest.toLocaleString()}
                            </p>

                          </div>

                        )}

                      </div>

                      {/* ===================================
                          VARIANTS
                      ==================================== */}

                      <div className="mt-4 space-y-2">

                        {variants.map(
                          (
                            variant: any,
                            idx: number
                          ) => {

                            const price =
                              Number(
                                variant.price
                              ) || 0;

                            const isLowest =
                              price === lowest;

                            return (

                              <div
                                key={idx}

                                className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-colors ${
                                  isLowest
                                    ? "bg-success/10 border-success/30"
                                    : "bg-muted/50 border-border"
                                }`}
                              >

                                <div className="flex items-center gap-3">

                                  <span className="font-semibold text-foreground">

                                    {variant.platform_name ||
                                      variant.platform}

                                  </span>

                                  {isLowest && (

                                    <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-1 rounded-full">

                                      LOWEST

                                    </span>

                                  )}

                                </div>

                                <div className="flex items-center gap-4">

                                  {/* RATING */}

                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">

                                    <Star
                                      size={13}
                                      className="fill-warning text-warning"
                                    />

                                    {variant.rating ||
                                      "N/A"}

                                  </div>

                                  {/* DELIVERY */}

                                  <span className="text-sm text-muted-foreground">

                                    {variant.delivery_days
                                      ? `${variant.delivery_days} days`
                                      : "N/A"}

                                  </span>

                                  {/* PRICE */}

                                  <span className="font-bold text-foreground">

                                    ₹
                                    {price.toLocaleString()}

                                  </span>

                                </div>

                              </div>

                            );

                          }
                        )}

                      </div>

                      {/* ===================================
                          ACTION
                      ==================================== */}

                      <div className="flex items-center gap-3 mt-5">

                        <Link
                          to={`/compare/${product.id}`}
                        >

                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">

                            <ShoppingCart
                              size={16}
                            />

                            Compare Prices

                          </Button>

                        </Link>

                      </div>

                    </div>

                  </div>

                </motion.div>

              );

            }
          )}

        </div>

      </div>

    </div>
  );
};

export default SearchResults;