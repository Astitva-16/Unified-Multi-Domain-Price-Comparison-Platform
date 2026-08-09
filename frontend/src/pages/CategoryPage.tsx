import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import {
  categories,
  products,
} from "@/data/mockData";

import { Button } from "@/components/ui/button";


const CategoryPage = () => {

  /* =====================================================
     PARAMS
  ===================================================== */

  const { id } = useParams();


  /* =====================================================
     CATEGORY
  ===================================================== */

  const category =
    categories.find(
      (c) => c.id === id
    );


  /* =====================================================
     CATEGORY PRODUCTS
  ===================================================== */

  const categoryProducts =
    products.filter(
      (p) => p.category === id
    );


  /*
    If no products are found for the category,
    show all products.
  */

  const displayProducts =
    categoryProducts.length
      ? categoryProducts
      : products;


  /* =====================================================
     PAGE
  ===================================================== */

  return (

    <div className="min-h-screen bg-background text-foreground">

      <div className="max-w-[1200px] mx-auto px-4 py-8">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-7"
        >

          <ArrowLeft size={16} />

          Back to dashboard

        </Link>


        {/* =================================================
            CATEGORY HEADER
        ================================================= */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl">

              {category?.icon || "🛍️"}

            </div>


            <div>

              <h1 className="text-3xl font-bold text-foreground">

                {category?.name || "Category"}

              </h1>


              <p className="text-muted-foreground mt-1">

                {category?.count
                  ? category.count.toLocaleString()
                  : displayProducts.length.toLocaleString()}{" "}

                items available

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            PRODUCT COUNT
        ================================================= */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-lg font-semibold text-foreground">

              Products

            </h2>


            <p className="text-sm text-muted-foreground mt-1">

              Compare prices across different platforms

            </p>

          </div>


          <div className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">

            {displayProducts.length}{" "}

            {displayProducts.length === 1
              ? "product"
              : "products"}

          </div>

        </div>


        {/* =================================================
            PRODUCTS GRID
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {displayProducts.map(
            (product, i) => {

              const lowest =
                Math.min(
                  ...product.prices.map(
                    (p) => p.price
                  )
                );


              return (

                <motion.div
                  key={product.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: i * 0.08,
                  }}
                  whileHover={{
                    y: -4,
                  }}
                >

                  <Link
                    to={`/compare/${product.id}`}
                    className="block h-full rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all duration-200"
                  >


                    {/* =====================================
                        PRODUCT IMAGE
                    ====================================== */}

                    <div className="aspect-[4/3] overflow-hidden bg-muted">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />

                    </div>


                    {/* =====================================
                        PRODUCT DETAILS
                    ====================================== */}

                    <div className="p-5">


                      {/* PRODUCT NAME */}

                      <p className="font-semibold text-foreground line-clamp-2 min-h-[48px]">

                        {product.name}

                      </p>


                      {/* PRICE */}

                      <div className="flex items-baseline gap-2 mt-3">

                        <span className="text-xl font-bold text-primary">

                          ₹
                          {lowest.toLocaleString()}

                        </span>


                        <span className="text-xs text-muted-foreground">

                          across{" "}

                          {product.prices.length}{" "}

                          platforms

                        </span>

                      </div>


                      {/* PLATFORM TAGS */}

                      <div className="flex flex-wrap gap-2 mt-4">

                        {product.prices.map(
                          (p) => (

                            <span
                              key={p.platform}
                              className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground"
                            >

                              {p.platform}

                            </span>

                          )
                        )}

                      </div>


                      {/* BUTTON */}

                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-5 text-xs border-border bg-background hover:bg-muted text-foreground"
                      >

                        Compare Prices

                      </Button>

                    </div>

                  </Link>

                </motion.div>

              );

            }
          )}

        </div>


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {displayProducts.length === 0 && (

          <div className="bg-card border border-border rounded-xl p-10 text-center">

            <div className="text-4xl mb-4">

              📦

            </div>


            <h2 className="text-xl font-bold text-foreground">

              No products found

            </h2>


            <p className="text-muted-foreground mt-2">

              There are currently no products
              available in this category.

            </p>


            <Link to="/home">

              <Button className="mt-6 bg-primary text-primary-foreground hover:opacity-90">

                Back to Home

              </Button>

            </Link>

          </div>

        )}

      </div>

    </div>

  );

};


export default CategoryPage;