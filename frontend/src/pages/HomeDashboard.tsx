import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  categories,
  deals,
  products,
  platformDeals,
} from "@/data/mockData";

import { useStore } from "@/store/useStore";

import {
  ChevronRight,
  Star,
  ShoppingCart,
} from "lucide-react";


/* =====================================================
   API
===================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "/api");


/* =====================================================
   ANIMATION
===================================================== */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: (i: number) => ({
    opacity: 1,
    y: 0,

    transition: {
      delay: i * 0.08,
    },
  }),
};


/* =====================================================
   TRENDING PRODUCT TYPES
===================================================== */

interface TrendingVariant {
  platform_name?: string;
  platform?: string;
  price: number;
  rating?: number;
  discount_percent?: number;
  discount?: string;
  delivery_days?: number;
  platform_url?: string;
}

interface TrendingProduct {
  id: string;
  product_name?: string;
  name?: string;
  image?: string;
  category?: string;

  variants?: TrendingVariant[];
  scored_variants?: TrendingVariant[];

  best_rating?: number;
  average_rating?: string;
  platforms_count?: number;
}


/* =====================================================
   FETCH TRENDING PRODUCTS
===================================================== */

const fetchTrendingProducts =
  async (): Promise<TrendingProduct[]> => {

    const queries = [
      "wireless earbuds",
      "smart watch",
      "running shoes",
      "cotton t shirt",
      "laptop",
      "smartphone",
    ];

    const responses = await Promise.all(
      queries.map(async (query) => {

        const params = new URLSearchParams({
          query,
          category: "shopping",
        });

        const response = await fetch(
          `${API_BASE_URL}/search?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to search ${query}`
          );
        }

        const data = await response.json();

        return data.results || [];

      })
    );

    return responses.flat();
  };


/* =====================================================
   HOME DASHBOARD
===================================================== */

const HomeDashboard = () => {

  const {
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
  } = useStore();


  const navigate = useNavigate();


  const [bannerIdx, setBannerIdx] =
    useState(0);


  const [
    trendingProducts,
    setTrendingProducts,
  ] = useState<TrendingProduct[]>([]);


  const [
    trendingLoading,
    setTrendingLoading,
  ] = useState(true);


  /* =====================================================
     BANNER AUTO CHANGE
  ====================================================== */

  useEffect(() => {

    if (deals.length === 0) {
      return;
    }

    const interval = setInterval(() => {

      setBannerIdx(
        (i) =>
          (i + 1) % deals.length
      );

    }, 3000);


    return () =>
      clearInterval(interval);

  }, []);


  /* =====================================================
     FETCH TRENDING
  ====================================================== */

  useEffect(() => {

    const loadTrending =
      async () => {

        try {

          setTrendingLoading(true);

          const fetchedProducts =
            await fetchTrendingProducts();

          setTrendingProducts(
            fetchedProducts
          );

        } catch (error) {

          console.error(
            "Trending products error:",
            error
          );

        } finally {

          setTrendingLoading(false);

        }

      };


    loadTrending();

  }, []);


  /* =====================================================
     CATEGORY CLICK
  ====================================================== */

  const handleCategoryClick =
    (id: string) => {

      setSelectedCategory(id);

      navigate(
        `/search?category=${id}`
      );

    };


  /* =====================================================
     SEARCH CATEGORY
  ====================================================== */

  const handleDealSearch =
    (category: string) => {

      setSearchQuery(category);

      navigate(
        `/search?q=${encodeURIComponent(
          category
        )}`
      );

    };


  /* =====================================================
     FIND CHEAPEST VARIANT
  ====================================================== */

  const getCheapest =
    (product: TrendingProduct) => {

      const variants =
        product.scored_variants ||
        product.variants ||
        [];

      if (variants.length === 0) {
        return null;
      }

      return [...variants].sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      )[0];

    };


  /* =====================================================
     RENDER
  ====================================================== */

  return (

    <div className="
      min-h-screen
      bg-slate-50
      dark:bg-slate-950
      transition-colors
      duration-300
    ">


      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="
        relative
        h-[350px]
        md:h-[380px]
        overflow-hidden
      ">

        {deals.map((deal, i) => (

          <motion.div
            key={deal.id}

            initial={false}

            animate={{
              opacity:
                i === bannerIdx
                  ? 1
                  : 0,

              scale:
                i === bannerIdx
                  ? 1
                  : 0.95,
            }}

            transition={{
              duration: 0.5,
            }}

            className={`
              absolute inset-0
              bg-gradient-to-r
              ${deal.gradient}
              flex items-center
              justify-center
              text-white
              p-8
              ${
                i === bannerIdx
                  ? "z-10"
                  : "z-0"
              }
            `}
          >

            <div className="text-center max-w-3xl">

              {deal.badge && (

                <div className="
                  inline-block
                  mb-4
                  px-4 py-2
                  rounded-full
                  bg-white/20
                  backdrop-blur-sm
                  text-sm
                  font-semibold
                ">

                  {deal.badge}

                </div>

              )}


              <h1 className="
                text-4xl
                md:text-5xl
                font-extrabold
                mb-4
              ">

                {deal.title}

              </h1>


              <p className="
                text-lg
                md:text-xl
                opacity-95
              ">

                {deal.subtitle}

              </p>


              <button
                type="button"
                onClick={() =>
                  navigate("/search")
                }
                className="
                  mt-7
                  px-6 py-3
                  rounded-xl
                  bg-white
                  text-slate-900
                  font-semibold
                  hover:bg-slate-100
                  transition-colors
                  shadow-lg
                "
              >

                Compare Deals

              </button>

            </div>

          </motion.div>

        ))}


        {/* Previous */}

        <button
          type="button"
          onClick={() =>
            setBannerIdx(
              (bannerIdx -
                1 +
                deals.length) %
                deals.length
            )
          }
          className="
            absolute
            left-5
            top-1/2
            -translate-y-1/2
            z-20
            w-10 h-10
            rounded-full
            bg-white/90
            text-slate-900
            shadow-md
            hover:bg-white
            flex items-center
            justify-center
            transition-all
          "
        >

          ←

        </button>


        {/* Next */}

        <button
          type="button"
          onClick={() =>
            setBannerIdx(
              (bannerIdx + 1) %
                deals.length
            )
          }
          className="
            absolute
            right-5
            top-1/2
            -translate-y-1/2
            z-20
            w-10 h-10
            rounded-full
            bg-white/90
            text-slate-900
            shadow-md
            hover:bg-white
            flex items-center
            justify-center
            transition-all
          "
        >

          →

        </button>


        {/* Dots */}

        <div className="
          absolute
          bottom-6
          left-1/2
          -translate-x-1/2
          z-20
          flex items-center
          gap-2
        ">

          {deals.map((_, i) => (

            <button
              type="button"
              key={i}
              onClick={() =>
                setBannerIdx(i)
              }
              className={`
                h-2
                rounded-full
                transition-all
                ${
                  i === bannerIdx
                    ? "bg-white w-7"
                    : "bg-white/50 w-2"
                }
              `}
            />

          ))}

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="
        max-w-[1400px]
        mx-auto
        px-4
        py-8
        space-y-12
      ">


        {/* =====================================================
            SHOP BY CATEGORY
        ====================================================== */}

        <section>

          <div className="
            flex items-end
            justify-between
            mb-5
          ">

            <div>

              <h2 className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-slate-100
              ">
                Shop by Category
              </h2>

              <p className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-1
              ">
                Find the best prices across every category
              </p>

            </div>


            <Link
              to="/search"
              className="
                flex items-center
                gap-1
                text-sm
                font-medium
                text-blue-600
                dark:text-blue-400
                hover:underline
              "
            >

              View all

              <ChevronRight size={16} />

            </Link>

          </div>


          <div className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-6
            gap-4
          ">

            {categories
              .slice(0, 6)
              .map((cat, i) => (

                <motion.button
                  key={cat.id}

                  type="button"

                  initial="hidden"

                  whileInView="visible"

                  viewport={{
                    once: true,
                  }}

                  variants={fadeUp}

                  custom={i}

                  whileHover={{
                    y: -5,
                    scale: 1.02,
                  }}

                  whileTap={{
                    scale: 0.97,
                  }}

                  onClick={() =>
                    handleCategoryClick(
                      cat.id
                    )
                  }

                  className={`
                    group
                    bg-white
                    dark:bg-slate-900
                    rounded-xl
                    border
                    overflow-hidden
                    transition-all
                    ${
                      selectedCategory ===
                      cat.id
                        ? "border-blue-500 shadow-lg dark:shadow-blue-950/30"
                        : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg"
                    }
                  `}
                >

                  <div className="
                    aspect-square
                    overflow-hidden
                    bg-slate-100
                    dark:bg-slate-800
                  ">

                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="
                        w-full h-full
                        object-cover
                        group-hover:scale-105
                        transition-transform
                        duration-300
                      "
                      loading="lazy"
                    />

                  </div>


                  <div className="p-3 text-center">

                    <div className="text-xl mb-1">
                      {cat.icon}
                    </div>

                    <p className="
                      font-semibold
                      text-sm
                      text-slate-900
                      dark:text-slate-100
                    ">
                      {cat.name}
                    </p>

                    <p className="
                      text-xs
                      text-slate-500
                      dark:text-slate-400
                      mt-1
                    ">
                      {cat.count.toLocaleString()}+
                      {" "}products
                    </p>

                  </div>

                </motion.button>

              ))}

          </div>

        </section>


        {/* =====================================================
            TODAY'S BEST DEALS
        ====================================================== */}

        <section>

          <div className="
            flex items-end
            justify-between
            mb-5
          ">

            <div>

              <div className="
                flex items-center
                gap-2
              ">

                <span className="text-2xl">
                  ⚡
                </span>

                <h3 className="
                  text-2xl
                  font-bold
                  text-slate-900
                  dark:text-slate-100
                ">
                  Today's Best Deals
                </h3>

              </div>

              <p className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-1
              ">
                Deals across popular shopping platforms
              </p>

            </div>

          </div>


          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
          ">

            {platformDeals.map(
              (deal, i) => (

                <motion.div
                  key={deal.id}

                  initial="hidden"

                  whileInView="visible"

                  viewport={{
                    once: true,
                  }}

                  variants={fadeUp}

                  custom={i}

                  whileHover={{
                    y: -5,
                  }}

                  className="
                    rounded-xl
                    overflow-hidden
                    bg-white
                    dark:bg-slate-900
                    border
                    border-slate-200
                    dark:border-slate-800
                    hover:shadow-xl
                    dark:hover:shadow-black/30
                    transition-all
                  "
                >

                  <div
                    className={`
                      bg-gradient-to-r
                      ${deal.gradient}
                      p-5
                      text-white
                    `}
                  >

                    <div className="
                      flex items-center
                      justify-between
                    ">

                      <div className="
                        flex items-center
                        gap-2
                      ">

                        <span className="text-2xl">
                          {deal.icon}
                        </span>

                        <span className="
                          font-bold
                          text-lg
                        ">
                          {deal.platform}
                        </span>

                      </div>

                      <span className="
                        text-xs
                        px-2 py-1
                        rounded-full
                        bg-white/20
                      ">
                        DEAL
                      </span>

                    </div>


                    <h4 className="
                      text-xl
                      font-bold
                      mt-5
                    ">
                      {deal.title}
                    </h4>


                    <div className="mt-3">

                      <span className="
                        inline-block
                        px-3 py-1.5
                        rounded-lg
                        bg-white
                        text-slate-900
                        text-sm
                        font-bold
                      ">
                        {deal.discount}
                      </span>

                    </div>

                  </div>


                  <div className="p-5">

                    <p className="
                      text-sm
                      text-slate-600
                      dark:text-slate-300
                    ">
                      {deal.description}
                    </p>


                    <div className="
                      flex items-center
                      justify-between
                      mt-4
                    ">

                      <span className="
                        text-xs
                        text-slate-500
                        dark:text-slate-400
                      ">
                        Category
                      </span>

                      <span className="
                        text-xs
                        font-semibold
                        text-slate-700
                        dark:text-slate-200
                      ">
                        {deal.category}
                      </span>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        handleDealSearch(
                          deal.category
                        )
                      }
                      className="
                        w-full
                        mt-5
                        py-2.5
                        rounded-lg
                        bg-slate-900
                        dark:bg-blue-600
                        text-white
                        text-sm
                        font-semibold
                        hover:bg-blue-600
                        dark:hover:bg-blue-500
                        transition-colors
                      "
                    >

                      Explore Deals →

                    </button>

                  </div>

                </motion.div>

              )
            )}

          </div>

        </section>


        {/* =====================================================
            DEALS UNDER ₹999
        ====================================================== */}

        <section>

          <div className="
            flex items-end
            justify-between
            mb-5
          ">

            <div>

              <div className="
                flex items-center
                gap-2
              ">

                <span className="text-2xl">
                  💰
                </span>

                <h3 className="
                  text-2xl
                  font-bold
                  text-slate-900
                  dark:text-slate-100
                ">
                  Deals Under ₹999
                </h3>

              </div>

              <p className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-1
              ">
                Best value products at prices you'll love
              </p>

            </div>


            <Link
              to="/search?maxPrice=999"
              className="
                flex items-center
                gap-1
                text-sm
                font-medium
                text-blue-600
                dark:text-blue-400
                hover:underline
              "
            >

              View all

              <ChevronRight size={16} />

            </Link>

          </div>


          <div className="
            flex
            gap-4
            overflow-x-auto
            pb-4
            scrollbar-hide
          ">

            {products
              .filter((product) => {

                const cheapest = Math.min(
                  ...product.prices.map(
                    (price) => price.price
                  )
                );

                return cheapest <= 999;

              })
              .map(
                (product, i) => {

                  const cheapest =
                    product.prices.reduce(
                      (best, current) =>
                        current.price <
                        best.price
                          ? current
                          : best
                    );


                  return (

                    <motion.div
                      key={product.id}

                      initial="hidden"

                      whileInView="visible"

                      viewport={{
                        once: true,
                      }}

                      variants={fadeUp}

                      custom={i}

                      whileHover={{
                        y: -5,
                      }}

                      className="
                        flex-shrink-0
                        w-[230px]
                      "
                    >

                      <Link
                        to={`/compare/${product.id}`}
                        className="
                          block
                          bg-white
                          dark:bg-slate-900
                          rounded-xl
                          border
                          border-slate-200
                          dark:border-slate-800
                          overflow-hidden
                          hover:shadow-xl
                          dark:hover:shadow-black/30
                          transition-all
                        "
                      >

                        <div className="
                          relative
                          h-[190px]
                          bg-slate-100
                          dark:bg-slate-800
                          overflow-hidden
                        ">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="
                              w-full h-full
                              object-cover
                              hover:scale-105
                              transition-transform
                              duration-300
                            "
                            loading="lazy"
                          />

                          {cheapest.discount && (

                            <span className="
                              absolute
                              top-3 left-3
                              px-2 py-1
                              rounded-md
                              bg-green-600
                              text-white
                              text-xs
                              font-semibold
                            ">
                              {cheapest.discount}
                            </span>

                          )}

                        </div>


                        <div className="p-4">

                          <h4 className="
                            font-semibold
                            text-sm
                            text-slate-900
                            dark:text-slate-100
                            line-clamp-2
                            min-h-[40px]
                          ">
                            {product.name}
                          </h4>


                          <div className="mt-3">

                            <span className="
                              text-xl
                              font-bold
                              text-slate-900
                              dark:text-white
                            ">
                              ₹
                              {cheapest.price.toLocaleString()}
                            </span>

                          </div>


                          <p className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                            mt-1
                          ">

                            Lowest on{" "}

                            <span className="
                              font-semibold
                              text-slate-700
                              dark:text-slate-200
                            ">
                              {cheapest.platform}
                            </span>

                          </p>


                          <div className="
                            w-full
                            mt-4
                            py-2
                            rounded-lg
                            bg-blue-600
                            dark:bg-blue-500
                            text-white
                            text-sm
                            font-semibold
                            text-center
                          ">
                            Compare Prices
                          </div>

                        </div>

                      </Link>

                    </motion.div>

                  );

                }
              )}

          </div>

        </section>


        {/* =====================================================
            TRENDING PRODUCTS
        ====================================================== */}

        <section>

          <div className="
            flex items-end
            justify-between
            mb-5
          ">

            <div>

              <div className="
                flex items-center
                gap-2
              ">

                <span className="text-2xl">
                  🔥
                </span>

                <h3 className="
                  text-2xl
                  font-bold
                  text-slate-900
                  dark:text-slate-100
                ">
                  Trending Products
                </h3>

              </div>

              <p className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-1
              ">
                Popular products people are comparing right now
              </p>

            </div>


            <Link
              to="/search"
              className="
                flex items-center
                gap-1
                text-sm
                font-medium
                text-blue-600
                dark:text-blue-400
                hover:underline
              "
            >

              View all

              <ChevronRight size={16} />

            </Link>

          </div>


          {/* =================================================
              LOADING
          ================================================== */}

          {trendingLoading && (

            <div className="
              flex gap-4
              overflow-hidden
            ">

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      flex-shrink-0
                      w-[240px]
                      bg-white
                      dark:bg-slate-900
                      rounded-xl
                      border
                      border-slate-200
                      dark:border-slate-800
                      overflow-hidden
                      animate-pulse
                    "
                  >

                    <div className="
                      h-[220px]
                      bg-slate-200
                      dark:bg-slate-800
                    " />

                    <div className="
                      p-4
                      space-y-3
                    ">

                      <div className="
                        h-4
                        bg-slate-200
                        dark:bg-slate-800
                        rounded
                      " />

                      <div className="
                        h-4
                        w-2/3
                        bg-slate-200
                        dark:bg-slate-800
                        rounded
                      " />

                      <div className="
                        h-8
                        bg-slate-200
                        dark:bg-slate-800
                        rounded
                      " />

                    </div>

                  </div>

                )
              )}

            </div>

          )}


          {/* =================================================
              PRODUCTS
          ================================================== */}

          {!trendingLoading &&
            trendingProducts.length > 0 && (

              <div className="
                flex gap-4
                overflow-x-auto
                pb-4
                scrollbar-hide
              ">

                {trendingProducts.map(
                  (product, i) => {

                    const cheapest =
                      getCheapest(product);


                    if (!cheapest) {
                      return null;
                    }


                    const ratingVariants =
                      product.scored_variants ||
                      product.variants ||
                      [];


                    const highestRating =
                      Math.max(
                        ...ratingVariants.map(
                          (variant) =>
                            Number(
                              variant.rating
                            ) || 0
                        )
                      );


                    return (

                      <motion.div
                        key={`${product.id}-${i}`}

                        initial="hidden"

                        whileInView="visible"

                        viewport={{
                          once: true,
                        }}

                        variants={fadeUp}

                        custom={i}

                        whileHover={{
                          y: -5,
                        }}

                        className="
                          flex-shrink-0
                          w-[240px]
                        "
                      >

                        <Link
                          to={`/compare/${product.id}`}
                          className="
                            block
                            h-full
                            bg-white
                            dark:bg-slate-900
                            rounded-xl
                            border
                            border-slate-200
                            dark:border-slate-800
                            overflow-hidden
                            hover:shadow-xl
                            dark:hover:shadow-black/30
                            transition-all
                          "
                        >

                          {/* Image */}

                          <div className="
                            relative
                            h-[220px]
                            bg-slate-100
                            dark:bg-slate-800
                            overflow-hidden
                          ">

                            {product.image ? (

                              <img
                                src={product.image}
                                alt={
                                  product.product_name ||
                                  product.name ||
                                  "Product"
                                }
                                className="
                                  w-full h-full
                                  object-cover
                                  hover:scale-105
                                  transition-transform
                                  duration-300
                                "
                                loading="lazy"
                              />

                            ) : (

                              <div className="
                                w-full h-full
                                flex items-center
                                justify-center
                                text-slate-400
                                dark:text-slate-500
                              ">
                                No image
                              </div>

                            )}


                            <div className="
                              absolute
                              top-3 left-3
                            ">

                              <span className="
                                px-2 py-1
                                rounded-md
                                bg-white/95
                                dark:bg-slate-950/90
                                shadow-sm
                                text-[11px]
                                font-semibold
                                text-slate-700
                                dark:text-slate-200
                              ">
                                Compare prices
                              </span>

                            </div>


                            {cheapest.discount && (

                              <div className="
                                absolute
                                bottom-3 left-3
                              ">

                                <span className="
                                  px-2 py-1
                                  rounded-md
                                  bg-green-600
                                  text-white
                                  text-xs
                                  font-semibold
                                ">

                                  {cheapest.discount}

                                </span>

                              </div>

                            )}

                          </div>


                          {/* Details */}

                          <div className="p-4">

                            <h4 className="
                              font-semibold
                              text-sm
                              text-slate-900
                              dark:text-slate-100
                              line-clamp-2
                              min-h-[40px]
                            ">

                              {product.product_name ||
                                product.name ||
                                "Product"}

                            </h4>


                            {/* Rating */}

                            <div className="
                              flex items-center
                              gap-2
                              mt-2
                            ">

                              <span className="
                                inline-flex
                                items-center
                                gap-1
                                px-2 py-1
                                rounded
                                bg-green-600
                                text-white
                                text-xs
                                font-semibold
                              ">

                                <Star
                                  size={11}
                                  className="fill-white"
                                />

                                {highestRating > 0
                                  ? highestRating
                                  : "N/A"}

                              </span>


                              <span className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                              ">

                                {product.platforms_count ||
                                  ratingVariants.length ||
                                  0}{" "}
                                stores

                              </span>

                            </div>


                            {/* Price */}

                            <div className="mt-3">

                              <div className="
                                flex items-baseline
                                gap-2
                              ">

                                <span className="
                                  text-xl
                                  font-bold
                                  text-slate-900
                                  dark:text-white
                                ">

                                  ₹
                                  {Number(
                                    cheapest.price
                                  ).toLocaleString()}

                                </span>

                                <span className="
                                  text-xs
                                  text-slate-500
                                  dark:text-slate-400
                                ">
                                  best price
                                </span>

                              </div>


                              <p className="
                                text-xs
                                text-slate-500
                                dark:text-slate-400
                                mt-1
                              ">

                                Lowest on{" "}

                                <span className="
                                  font-semibold
                                  text-slate-700
                                  dark:text-slate-200
                                ">

                                  {cheapest.platform_name ||
                                    cheapest.platform}

                                </span>

                              </p>

                            </div>


                            {/* Button */}

                            <div className="
                              w-full
                              mt-4
                              py-2.5
                              rounded-lg
                              bg-blue-600
                              dark:bg-blue-500
                              text-white
                              text-sm
                              font-semibold
                              text-center
                            ">

                              Compare Prices

                            </div>

                          </div>

                        </Link>

                      </motion.div>

                    );

                  }
                )}

              </div>

            )}


          {/* =================================================
              ERROR / EMPTY
          ================================================== */}

          {!trendingLoading &&
            trendingProducts.length === 0 && (

              <div className="
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-800
                rounded-xl
                p-8
                text-center
              ">

                <ShoppingCart
                  size={32}
                  className="
                    mx-auto
                    text-slate-400
                    dark:text-slate-500
                  "
                />

                <p className="
                  font-semibold
                  text-slate-700
                  dark:text-slate-200
                  mt-3
                ">
                  Trending products are unavailable right now.
                </p>

                <p className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                  mt-1
                ">
                  Try searching for a product instead.
                </p>

                <Link
                  to="/search"
                  className="
                    inline-block
                    mt-4
                    px-5 py-2
                    rounded-lg
                    bg-blue-600
                    dark:bg-blue-500
                    hover:bg-blue-700
                    dark:hover:bg-blue-600
                    text-white
                    text-sm
                    font-semibold
                    transition-colors
                  "
                >
                  Search Products
                </Link>

              </div>

            )}

        </section>

      </div>

    </div>

  );

};


export default HomeDashboard;