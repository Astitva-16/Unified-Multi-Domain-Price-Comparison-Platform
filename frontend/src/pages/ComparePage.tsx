import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import {
  ArrowLeft,
  ExternalLink,
  ShoppingCart,
  Star,
  Truck,
  Trophy,
  BadgePercent,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStore } from "@/store/useStore";


/* =====================================================
   API
===================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "/api");


/* =====================================================
   FETCH PRODUCT
===================================================== */

const fetchProduct = async (
  id: string | undefined
) => {

  if (!id) {
    throw new Error("Missing product id");
  }

  const response = await fetch(
    `${API_BASE_URL}/product/${encodeURIComponent(id)}`
  );

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();

};


/* =====================================================
   COMPARE PAGE
===================================================== */

const ComparePage = () => {

  const { id } = useParams();

  const {
    addToCart,
  } = useStore();


  /* =====================================================
     FETCH PRODUCT
  ===================================================== */

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({

    queryKey: [
      "product",
      id,
    ],

    queryFn: () =>
      fetchProduct(id),

    enabled: !!id,

    staleTime: 30 * 60 * 1000,

  });


  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {

    return (

      <div className="min-h-screen bg-background">

        <div className="max-w-[1200px] mx-auto px-4 py-10">

          <div className="animate-pulse">

            {/* Back Button Skeleton */}

            <div className="h-5 w-32 bg-muted rounded mb-8" />


            {/* Product Skeleton */}

            <div className="grid md:grid-cols-[320px_1fr] gap-8">

              <div className="aspect-square bg-muted rounded-2xl" />

              <div className="space-y-4">

                <div className="h-8 bg-muted rounded w-3/4" />

                <div className="h-5 bg-muted rounded w-1/3" />

                <div className="h-12 bg-muted rounded w-1/2" />

                <div className="h-5 bg-muted rounded w-2/3" />

              </div>

            </div>


            {/* Cards Skeleton */}

            <div className="grid sm:grid-cols-3 gap-4 mt-8">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="h-40 bg-muted rounded-xl"
                />

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

  if (error || !product) {

    return (

      <div className="min-h-[70vh] bg-background flex items-center justify-center px-4">

        <div className="text-center">

          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">

            <ShoppingCart
              size={28}
              className="text-destructive"
            />

          </div>


          <h1 className="text-2xl font-bold text-foreground mt-5">

            Product not found

          </h1>


          <p className="text-muted-foreground mt-2">

            We couldn't load this product.

          </p>


          <Link
            to="/search"
            className="inline-flex items-center gap-2 mt-5 text-primary hover:underline"
          >

            <ArrowLeft size={16} />

            Back to Search

          </Link>

        </div>

      </div>

    );

  }


  /* =====================================================
     PRODUCT DATA
  ===================================================== */

  const variants =
    product.variants || [];


  const productName =
    product.product_name ||
    product.name ||
    "Product";


  const validPrices =
    variants
      .map(
        (variant: any) =>
          Number(variant.price)
      )
      .filter(
        (price: number) =>
          price > 0
      );


  const lowestPrice =
    validPrices.length > 0
      ? Math.min(...validPrices)
      : 0;


  const highestPrice =
    validPrices.length > 0
      ? Math.max(...validPrices)
      : 0;


  const averagePrice =
    validPrices.length > 0
      ? Math.floor(

          validPrices.reduce(
            (
              sum: number,
              price: number
            ) =>
              sum + price,
            0
          ) / validPrices.length

        )
      : 0;


  /* =====================================================
     SAVINGS
  ===================================================== */

  const savings =
    product.savings_analysis?.savings ??
    Math.max(
      0,
      averagePrice - lowestPrice
    );


  const savingsPercent =
    product.savings_analysis?.savings_percent ??
    (
      averagePrice > 0
        ? Math.floor(
            (savings / averagePrice) *
            100
          )
        : 0
    );


  /* =====================================================
     BEST VARIANTS
  ===================================================== */

  const cheapest =
    variants.length > 0
      ? [...variants]
          .filter(
            (variant: any) =>
              Number(variant.price) > 0
          )
          .sort(
            (a: any, b: any) =>
              Number(a.price) -
              Number(b.price)
          )[0]
      : null;


  const bestQuality =
    variants.length > 0
      ? [...variants]
          .sort(
            (a: any, b: any) =>
              Number(b.rating || 0) -
              Number(a.rating || 0)
          )[0]
      : null;


  const bestValue =
    product.value_analysis?.best_value ||
    product.recommendations?.find(
      (recommendation: any) =>
        recommendation.type === "best_value"
    )?.product ||
    cheapest;


  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = (
    variant: any
  ) => {

    addToCart(

      {
        id: product.id,

        name: productName,

        image: product.image || "",

        category:
          product.category ||
          "shopping",

        prices: variants.map(
          (item: any) => ({

            platform:
              item.platform_name ||
              item.platform,

            price:
              Number(item.price) || 0,

            rating:
              Number(item.rating) || 0,

            delivery:
              item.delivery ||
              (
                item.delivery_days
                  ? `${item.delivery_days} days`
                  : "N/A"
              ),

            discount:
              item.discount ||
              (
                item.discount_percent
                  ? `${item.discount_percent}% off`
                  : undefined
              ),

          })
        ),

      },

      variant.platform_name ||
        variant.platform,

      Number(variant.price) || 0,

      variant.platform_url

    );

  };


  /* =====================================================
     BUY PRODUCT
  ===================================================== */

  const handleBuy = (
    platformUrl: string | undefined
  ) => {

    if (!platformUrl) {
      alert(
        "Product link is currently unavailable."
      );

      return;
    }

    window.open(
      platformUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="min-h-screen bg-background">

      <div className="max-w-[1200px] mx-auto px-4 py-6">


        {/* =================================================
            BACK
        ================================================== */}

        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >

          <ArrowLeft size={16} />

          Back to results

        </Link>


        {/* =================================================
            PRODUCT HEADER
        ================================================== */}

        <motion.section

          initial={{
            opacity: 0,
            y: 15,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="bg-card rounded-2xl border border-border p-5 md:p-7"

        >

          <div className="grid md:grid-cols-[300px_1fr] gap-8">


            {/* Product Image */}

            <div className="aspect-square bg-muted rounded-xl overflow-hidden">

              {product.image ? (

                <img
                  src={product.image}
                  alt={productName}
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="w-full h-full flex items-center justify-center text-muted-foreground">

                  No Image Available

                </div>

              )}

            </div>


            {/* Product Info */}

            <div className="flex flex-col justify-center">


              <p className="text-xs uppercase tracking-wide text-primary font-semibold">

                {product.category ||
                  "Shopping"}

              </p>


              <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-2">

                {productName}

              </h1>


              {/* Rating */}

              <div className="flex items-center gap-3 mt-4">

                <div className="inline-flex items-center gap-1 bg-success text-success-foreground px-2.5 py-1 rounded-md text-sm font-semibold">

                  <Star
                    size={14}
                    className="fill-current"
                  />

                  {product.average_rating ||
                    product.best_rating ||
                    "4.0"}

                </div>


                <span className="text-sm text-muted-foreground">

                  Compared across{" "}

                  {variants.length}{" "}

                  platforms

                </span>

              </div>


              {/* Best Price */}

              <div className="mt-7">

                <p className="text-sm text-muted-foreground">

                  Best price available

                </p>


                <div className="flex flex-wrap items-baseline gap-3 mt-1">

                  <span className="text-3xl font-bold text-foreground">

                    ₹
                    {lowestPrice.toLocaleString()}

                  </span>


                  {savings > 0 && (

                    <span className="text-sm font-semibold text-success">

                      Save ₹
                      {savings.toLocaleString()}

                    </span>

                  )}

                </div>


                {cheapest && (

                  <p className="text-sm text-muted-foreground mt-1">

                    Lowest on{" "}

                    <span className="font-semibold text-foreground">

                      {cheapest.platform_name ||
                        cheapest.platform}

                    </span>

                  </p>

                )}

              </div>

            </div>

          </div>

        </motion.section>


        {/* =================================================
            HIGHLIGHTS
        ================================================== */}

        <section className="grid sm:grid-cols-3 gap-4 mt-6">


          {/* Best Value */}

          <div className="bg-card border border-border rounded-xl p-5">

            <div className="flex items-center gap-2 text-primary">

              <Trophy size={20} />

              <span className="font-semibold">

                Best Value

              </span>

            </div>


            <p className="text-xl font-bold text-foreground mt-4">

              {bestValue?.platform_name ||
                bestValue?.platform ||
                cheapest?.platform_name ||
                "—"}

            </p>


            <p className="text-sm text-muted-foreground mt-1">

              Best overall combination

            </p>

          </div>


          {/* Cheapest */}

          <div className="bg-card border border-border rounded-xl p-5">

            <div className="flex items-center gap-2 text-success">

              <BadgePercent size={20} />

              <span className="font-semibold">

                Cheapest

              </span>

            </div>


            <p className="text-xl font-bold text-foreground mt-4">

              ₹
              {lowestPrice.toLocaleString()}

            </p>


            <p className="text-sm text-muted-foreground mt-1">

              On{" "}

              {cheapest?.platform_name ||
                cheapest?.platform ||
                "—"}

            </p>

          </div>


          {/* Best Rated */}

          <div className="bg-card border border-border rounded-xl p-5">

            <div className="flex items-center gap-2 text-warning">

              <ShieldCheck size={20} />

              <span className="font-semibold">

                Best Rated

              </span>

            </div>


            <p className="text-xl font-bold text-foreground mt-4">

              {bestQuality?.rating ||
                "—"}{" "}

              ⭐

            </p>


            <p className="text-sm text-muted-foreground mt-1">

              On{" "}

              {bestQuality?.platform_name ||
                bestQuality?.platform ||
                "—"}

            </p>

          </div>

        </section>


        {/* =================================================
            SAVINGS SUMMARY
        ================================================== */}

        <section className="bg-card border border-border rounded-xl p-5 md:p-6 mt-6">

          <div className="flex items-center gap-2">

            <BadgePercent
              size={20}
              className="text-success"
            />

            <h2 className="text-lg font-bold text-foreground">

              Price Summary

            </h2>

          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">


            <div>

              <p className="text-sm text-muted-foreground">

                Lowest Price

              </p>

              <p className="text-xl font-bold text-foreground mt-1">

                ₹
                {lowestPrice.toLocaleString()}

              </p>

            </div>


            <div>

              <p className="text-sm text-muted-foreground">

                Average Price

              </p>

              <p className="text-xl font-bold text-foreground mt-1">

                ₹
                {averagePrice.toLocaleString()}

              </p>

            </div>


            <div>

              <p className="text-sm text-muted-foreground">

                Highest Price

              </p>

              <p className="text-xl font-bold text-foreground mt-1">

                ₹
                {highestPrice.toLocaleString()}

              </p>

            </div>


            <div>

              <p className="text-sm text-muted-foreground">

                You Save

              </p>

              <p className="text-xl font-bold text-success mt-1">

                ₹
                {savings.toLocaleString()}

                <span className="text-sm ml-1">

                  ({savingsPercent}%)

                </span>

              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            PLATFORM COMPARISON
        ================================================== */}

        <section className="mt-8">


          <div className="mb-4">

            <h2 className="text-xl font-bold text-foreground">

              Compare Prices

            </h2>


            <p className="text-sm text-muted-foreground mt-1">

              Find the best place to buy this product.

            </p>

          </div>


          <div className="space-y-4">


            {variants

              .slice()

              .sort(
                (a: any, b: any) =>
                  Number(a.price) -
                  Number(b.price)
              )

              .map(
                (
                  variant: any,
                  index: number
                ) => {

                  const price =
                    Number(variant.price) || 0;


                  const isBestPrice =
                    price > 0 &&
                    price === lowestPrice;


                  const discount =
                    Number(
                      variant.discount_percent
                    ) || 0;


                  const platformName =
                    variant.platform_name ||
                    variant.platform ||
                    "Unknown";


                  return (

                    <motion.div

                      key={
                        variant.id ||
                        `${platformName}-${index}`
                      }

                      initial={{
                        opacity: 0,
                        y: 10,
                      }}

                      animate={{
                        opacity: 1,
                        y: 0,
                      }}

                      transition={{
                        delay:
                          index * 0.08,
                      }}

                      className={`bg-card rounded-xl border p-5 md:p-6 transition-shadow hover:shadow-md ${
                        isBestPrice
                          ? "border-success/60 ring-1 ring-success/20"
                          : "border-border"
                      }`}

                    >

                      <div className="flex flex-col lg:flex-row lg:items-center gap-5">


                        {/* Platform */}

                        <div className="lg:w-40">

                          <div className="flex items-center gap-2">


                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-sm text-foreground">

                              {platformName
                                .charAt(0)
                                .toUpperCase()}

                            </div>


                            <div>

                              <p className="font-bold text-foreground">

                                {platformName}

                              </p>


                              {isBestPrice && (

                                <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">

                                  🏆 BEST PRICE

                                </span>

                              )}

                            </div>

                          </div>

                        </div>


                        {/* Price */}

                        <div className="flex-1">


                          <div className="flex flex-wrap items-baseline gap-3">

                            <span className="text-2xl font-bold text-foreground">

                              ₹
                              {price.toLocaleString()}

                            </span>


                            {discount > 0 && (

                              <span className="text-sm font-semibold text-success">

                                {discount}% off

                              </span>

                            )}

                          </div>


                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">


                            {/* Rating */}

                            <div className="flex items-center gap-1">

                              <Star
                                size={14}
                                className="fill-yellow-400 text-yellow-400"
                              />

                              <span className="font-medium text-foreground">

                                {variant.rating ||
                                  "N/A"}

                              </span>

                            </div>


                            {/* Delivery */}

                            <div className="flex items-center gap-1">

                              <Truck
                                size={14}
                              />

                              <span>

                                {variant.delivery ||
                                  (
                                    variant.delivery_days
                                      ? `${variant.delivery_days} days`
                                      : "Delivery unavailable"
                                  )}

                              </span>

                            </div>


                            {/* Reviews */}

                            {variant.review_count && (

                              <span>

                                {Number(
                                  variant.review_count
                                ).toLocaleString()}{" "}

                                reviews

                              </span>

                            )}

                          </div>

                        </div>


                        {/* Actions */}

                        <div className="flex flex-wrap gap-2">


                          {/* Add to Cart */}

                          <Button

                            size="sm"

                            variant="outline"

                            onClick={() =>
                              handleAddToCart(
                                variant
                              )
                            }

                            className="gap-2 border-border bg-card text-foreground hover:bg-muted"

                          >

                            <ShoppingCart
                              size={15}
                            />

                            Add to Cart

                          </Button>


                          {/* Buy */}

                          <Button

                            size="sm"

                            onClick={() =>
                              handleBuy(
                                variant.platform_url
                              )
                            }

                            disabled={
                              !variant.platform_url
                            }

                            className={`gap-2 ${
                              isBestPrice
                                ? "bg-success text-success-foreground hover:bg-success/90"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                            }`}

                          >

                            Buy

                            <ExternalLink
                              size={14}
                            />

                          </Button>

                        </div>

                      </div>

                    </motion.div>

                  );

                }

              )}

          </div>


          {/* No Platforms */}

          {variants.length === 0 && (

            <div className="bg-card border border-border rounded-xl p-10 text-center">

              <ShoppingCart
                size={40}
                className="mx-auto text-muted-foreground"
              />

              <h3 className="text-lg font-bold text-foreground mt-4">

                No price comparisons available

              </h3>

              <p className="text-sm text-muted-foreground mt-2">

                We couldn't find platform pricing for this product.

              </p>

            </div>

          )}

        </section>


        {/* =================================================
            RECOMMENDATION
        ================================================== */}

        {product.comparison_summary && (

          <section className="bg-accent/60 border border-border rounded-xl p-5 mt-8">

            <div className="flex items-center gap-2">

              <Trophy
                size={20}
                className="text-primary"
              />

              <h2 className="font-bold text-foreground">

                Mol Bhao Recommendation

              </h2>

            </div>


            <p className="text-sm text-muted-foreground mt-3 leading-6">

              {typeof product.comparison_summary ===
              "string"

                ? product.comparison_summary

                : product.comparison_summary.summary}

            </p>

          </section>

        )}


      </div>

    </div>

  );

};


export default ComparePage;