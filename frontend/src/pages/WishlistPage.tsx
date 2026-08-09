import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import {
  Heart,
  ShoppingCart,
  Trash2,
  Search,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useStore } from "@/store/useStore";


/* =====================================================
   WISHLIST PAGE
===================================================== */

const WishlistPage = () => {

  /* =====================================================
     STORE
  ===================================================== */

  const {
    wishlist,
    removeFromWishlist,
    addToCart,
  } = useStore();


  /* =====================================================
     REMOVE FROM WISHLIST
  ===================================================== */

  const handleRemove = (
    productId: string
  ) => {

    removeFromWishlist(
      productId
    );

  };


  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = (
    product: any
  ) => {

    const prices =
      product.prices || [];


    const cheapestPlatform =
      [...prices]
        .filter(
          (item: any) =>
            Number(item.price) > 0
        )
        .sort(
          (a: any, b: any) =>
            Number(a.price) -
            Number(b.price)
        )[0];


    if (!cheapestPlatform) {

      alert(
        "Price information is not available for this product."
      );

      return;

    }


    addToCart(

      product,

      cheapestPlatform.platform ||
        cheapestPlatform.platform_name ||
        "Unknown",

      Number(
        cheapestPlatform.price
      ),

      cheapestPlatform.platformUrl ||
        cheapestPlatform.platform_url

    );

  };


  /* =====================================================
     EMPTY WISHLIST
  ===================================================== */

  if (wishlist.length === 0) {

    return (

      <div
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
          px-4
        "
      >

        <motion.div

          initial={{
            opacity: 0,
            y: 20,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          className="
            max-w-md
            w-full
            text-center
          "
        >

          <div
            className="
              w-20
              h-20
              mx-auto
              rounded-full
              bg-red-500/10
              flex
              items-center
              justify-center
            "
          >

            <Heart
              size={38}
              className="
                text-red-500
              "
            />

          </div>


          <h1
            className="
              text-2xl
              font-bold
              mt-6
            "
          >

            Your Wishlist is Empty

          </h1>


          <p
            className="
              text-muted-foreground
              mt-3
              leading-6
            "
          >

            Save products you like and easily compare
            their prices later.

          </p>


          <Button
            asChild
            className="
              mt-6
              gap-2
            "
          >

            <Link to="/home">

              <Search size={18} />

              Explore Products

            </Link>

          </Button>

        </motion.div>

      </div>

    );

  }


  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (

    <div
      className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-8
      "
    >


      {/* =================================================
          HEADER
      ================================================= */}

      <motion.div

        initial={{
          opacity: 0,
          y: 15,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          mb-8
        "
      >

        <div>

          <h1
            className="
              text-3xl
              font-bold
              flex
              items-center
              gap-3
            "
          >

            <Heart
              size={30}
              className="
                text-red-500
                fill-red-500
              "
            />

            My Wishlist

          </h1>


          <p
            className="
              text-muted-foreground
              mt-2
            "
          >

            {wishlist.length}{" "}

            {wishlist.length === 1
              ? "product"
              : "products"}

            {" "}saved in your wishlist

          </p>

        </div>


        <Button
          asChild
          variant="outline"
          className="
            gap-2
            w-fit
          "
        >

          <Link to="/home">

            <Search size={17} />

            Continue Shopping

          </Link>

        </Button>

      </motion.div>


      {/* =================================================
          WISHLIST GRID
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-5
        "
      >

        {wishlist.map(
          (
            wishlistItem: any,
            index: number
          ) => {


            /* =============================================
               ACTUAL PRODUCT

               Store structure:
               wishlistItem = {
                 product: Product
               }
            ============================================= */

            const product =
              wishlistItem.product;


            /* =============================================
               SAFETY
            ============================================= */

            if (!product) {
              return null;
            }


            /* =============================================
               PRODUCT DATA
            ============================================= */

            const prices =
              product.prices || [];


            const validPrices =
              prices
                .map(
                  (priceItem: any) =>
                    Number(
                      priceItem.price
                    )
                )
                .filter(
                  (price: number) =>
                    price > 0
                );


            const lowestPrice =
              validPrices.length > 0
                ? Math.min(
                    ...validPrices
                  )
                : 0;


            const cheapestPlatform =
              [...prices]
                .filter(
                  (priceItem: any) =>
                    Number(
                      priceItem.price
                    ) > 0
                )
                .sort(
                  (
                    a: any,
                    b: any
                  ) =>
                    Number(a.price) -
                    Number(b.price)
                )[0];


            return (

              <motion.div

                key={product.id}

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay:
                    index * 0.05,
                }}

                className="
                  bg-card
                  border
                  border-border
                  rounded-2xl
                  overflow-hidden
                  flex
                  flex-col
                  hover:shadow-lg
                  transition-shadow
                "
              >


                {/* =========================================
                    IMAGE
                ========================================== */}

                <Link

                  to={`/compare/${product.id}`}

                  className="
                    relative
                    block
                    aspect-square
                    bg-muted
                    overflow-hidden
                  "
                >

                  {product.image ? (

                    <img

                      src={product.image}

                      alt={
                        product.name ||
                        "Product"
                      }

                      className="
                        w-full
                        h-full
                        object-cover
                        hover:scale-105
                        transition-transform
                        duration-300
                      "
                    />

                  ) : (

                    <div
                      className="
                        w-full
                        h-full
                        flex
                        items-center
                        justify-center
                        text-muted-foreground
                      "
                    >

                      No Image Available

                    </div>

                  )}


                  {/* WISHLIST HEART */}

                  <button

                    type="button"

                    onClick={(
                      event
                    ) => {

                      event.preventDefault();

                      event.stopPropagation();

                      handleRemove(
                        product.id
                      );

                    }}

                    className="
                      absolute
                      top-3
                      right-3
                      w-10
                      h-10
                      rounded-full
                      bg-white
                      dark:bg-slate-900
                      shadow-md
                      flex
                      items-center
                      justify-center
                      text-red-500
                      hover:scale-110
                      transition-transform
                    "

                    title="Remove from wishlist"
                  >

                    <Heart
                      size={20}
                      className="
                        fill-red-500
                      "
                    />

                  </button>

                </Link>


                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                  className="
                    p-4
                    flex
                    flex-col
                    flex-1
                  "
                >


                  {/* CATEGORY */}

                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-wide
                      text-primary
                      font-semibold
                    "
                  >

                    {
                      product.category ||
                      "Shopping"
                    }

                  </p>


                  {/* PRODUCT NAME */}

                  <Link
                    to={`/compare/${product.id}`}
                  >

                    <h2
                      className="
                        font-bold
                        text-foreground
                        mt-2
                        line-clamp-2
                        min-h-[48px]
                        hover:text-primary
                        transition-colors
                      "
                    >

                      {
                        product.name ||
                        "Product"
                      }

                    </h2>

                  </Link>


                  {/* PRICE */}

                  <div
                    className="
                      mt-4
                    "
                  >

                    <p
                      className="
                        text-xs
                        text-muted-foreground
                      "
                    >

                      Best price

                    </p>


                    <p
                      className="
                        text-xl
                        font-bold
                        text-foreground
                        mt-1
                      "
                    >

                      {
                        lowestPrice > 0

                          ? `₹${lowestPrice.toLocaleString()}`

                          : "Price unavailable"
                      }

                    </p>


                    {
                      cheapestPlatform && (

                        <p
                          className="
                            text-xs
                            text-muted-foreground
                            mt-1
                          "
                        >

                          Lowest on{" "}

                          {
                            cheapestPlatform.platform ||
                            cheapestPlatform.platform_name ||
                            cheapestPlatform.platformName ||
                            "platform"
                          }

                        </p>

                      )
                    }

                  </div>


                  {/* =======================================
                      ACTIONS
                  ======================================== */}

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-2
                      mt-auto
                      pt-5
                    "
                  >


                    {/* ADD TO CART */}

                    <Button

                      size="sm"

                      variant="outline"

                      onClick={() =>
                        handleAddToCart(
                          product
                        )
                      }

                      disabled={
                        !cheapestPlatform
                      }

                      className="
                        gap-2
                      "
                    >

                      <ShoppingCart
                        size={16}
                      />

                      Add to Cart

                    </Button>


                    {/* VIEW PRODUCT */}

                    <Button
                      size="sm"
                      asChild
                      className="
                        gap-2
                      "
                    >

                      <Link
                        to={`/compare/${product.id}`}
                      >

                        View

                        <ExternalLink
                          size={15}
                        />

                      </Link>

                    </Button>

                  </div>


                  {/* REMOVE BUTTON */}

                  <button

                    type="button"

                    onClick={() =>
                      handleRemove(
                        product.id
                      )
                    }

                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      mt-3
                      py-2
                      text-sm
                      text-red-500
                      hover:text-red-600
                      transition-colors
                    "
                  >

                    <Trash2
                      size={16}
                    />

                    Remove from Wishlist

                  </button>

                </div>

              </motion.div>

            );

          }

        )}

      </div>

    </div>

  );

};


export default WishlistPage;