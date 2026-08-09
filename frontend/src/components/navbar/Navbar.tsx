import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  Mic,
  Camera,
} from "lucide-react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { useStore } from "@/store/useStore";
import { categories } from "@/data/mockData";
import LocationModal from "@/components/LocationModal";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {

  /* =====================================================
     DROPDOWN STATES
  ====================================================== */

  const [locationOpen, setLocationOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [categoryOpen, setCategoryOpen] =
    useState(false);


  /* =====================================================
     STORE
  ====================================================== */

  const {
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    cart,
    location,
  } = useStore();


  const navigate = useNavigate();


  /* =====================================================
     SEARCH
  ====================================================== */

  const handleSearch = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!searchQuery.trim()) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(
        searchQuery.trim()
      )}`
    );

  };


  /* =====================================================
     CATEGORY
  ====================================================== */

  const handleCategoryClick = (
    id: string
  ) => {

    setSelectedCategory(id);

    setCategoryOpen(false);

    navigate(
      `/search?category=${id}`
    );

  };


  /* =====================================================
     CART COUNT
  ====================================================== */

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );


  /* =====================================================
     UI
  ====================================================== */

  return (

    <>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="
        sticky top-0 z-50
        bg-white/95 dark:bg-slate-950/95
        backdrop-blur-xl
        border-b border-slate-200 dark:border-slate-800
        shadow-sm dark:shadow-black/20
        transition-colors duration-300
      ">

        <div className="max-w-[1500px] mx-auto px-4 lg:px-8">


          {/* =================================================
              MAIN NAVBAR
          ================================================== */}

          <div className="min-h-[76px] flex items-center gap-3 lg:gap-5">


            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              to="/home"
              className="flex-shrink-0"
            >

              <span className="text-3xl font-extrabold tracking-tight">

                <span className="text-blue-600 dark:text-blue-400">
                  Mol
                </span>

                <span className="text-slate-900 dark:text-slate-100">
                  Bhao
                </span>

              </span>

            </Link>


            {/* =================================================
                LOCATION
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setLocationOpen(true)
              }
              className="
                hidden lg:flex
                items-center gap-2
                px-3 py-2
                rounded-lg
                text-left flex-shrink-0
                hover:bg-slate-100
                dark:hover:bg-slate-900
                transition-colors
              "
            >

              <MapPin
                size={22}
                className="
                  text-slate-700
                  dark:text-slate-300
                "
              />


              <div>

                <p className="
                  text-[11px]
                  text-slate-500
                  dark:text-slate-400
                  leading-none
                ">
                  Deliver to
                </p>


                <div className="flex items-center gap-1">

                  <span className="
                    text-sm font-bold
                    text-slate-900
                    dark:text-slate-100
                  ">

                    {location ||
                      "Select location"}

                  </span>

                  <ChevronDown
                    size={14}
                    className="
                      text-slate-500
                      dark:text-slate-400
                    "
                  />

                </div>

              </div>

            </button>


            {/* =================================================
                SEARCH BAR
            ================================================== */}

            <form
              onSubmit={handleSearch}
              className="flex-1 min-w-0"
            >

              <div className="
                flex items-center
                h-[48px]
                border
                border-blue-500
                dark:border-blue-500/70
                rounded-xl
                overflow-hidden
                bg-white
                dark:bg-slate-900
                shadow-sm
                focus-within:ring-2
                focus-within:ring-blue-500/20
                transition-all
              ">


                {/* =============================================
                    CATEGORY SELECTOR
                ============================================== */}

                <div className="relative hidden sm:block">

                  <button
                    type="button"
                    onClick={() =>
                      setCategoryOpen(
                        !categoryOpen
                      )
                    }
                    className="
                      h-[46px]
                      px-4
                      flex items-center gap-2
                      border-r
                      border-slate-200
                      dark:border-slate-700
                      bg-slate-50
                      dark:bg-slate-800
                      text-sm font-medium
                      text-slate-700
                      dark:text-slate-200
                      hover:bg-slate-100
                      dark:hover:bg-slate-700
                      transition-colors
                    "
                  >

                    All

                    <ChevronDown
                      size={15}
                    />

                  </button>


                  {/* Category Dropdown */}

                  <AnimatePresence>

                    {categoryOpen && (

                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -5,
                        }}
                        className="
                          absolute top-full left-0
                          mt-2 w-56
                          bg-white
                          dark:bg-slate-900
                          rounded-xl
                          border border-slate-200
                          dark:border-slate-700
                          shadow-xl
                          dark:shadow-black/40
                          p-2
                          z-[60]
                        "
                      >


                        {/* All Categories */}

                        <button
                          type="button"
                          onClick={() => {

                            setCategoryOpen(
                              false
                            );

                            setSelectedCategory(
                              null
                            );

                            navigate(
                              "/search"
                            );

                          }}
                          className="
                            w-full text-left
                            px-3 py-2.5
                            rounded-lg
                            text-sm font-medium
                            text-slate-800
                            dark:text-slate-100
                            hover:bg-slate-100
                            dark:hover:bg-slate-800
                            transition-colors
                          "
                        >

                          All Categories

                        </button>


                        {/* Categories */}

                        {categories.map(
                          (cat) => (

                            <button
                              key={cat.id}
                              type="button"
                              onClick={() =>
                                handleCategoryClick(
                                  cat.id
                                )
                              }
                              className="
                                w-full
                                flex items-center gap-3
                                text-left
                                px-3 py-2.5
                                rounded-lg
                                text-sm
                                text-slate-700
                                dark:text-slate-200
                                hover:bg-slate-100
                                dark:hover:bg-slate-800
                                transition-colors
                              "
                            >

                              <span>
                                {cat.icon}
                              </span>

                              {cat.name}

                            </button>

                          )
                        )}

                      </motion.div>

                    )}

                  </AnimatePresence>

                </div>


                {/* =============================================
                    SEARCH INPUT
                ============================================== */}

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder="Search for products, brands and more"
                  className="
                    flex-1 min-w-0
                    h-full px-4
                    text-sm
                    bg-transparent
                    text-slate-900
                    dark:text-slate-100
                    placeholder:text-slate-400
                    dark:placeholder:text-slate-500
                    focus:outline-none
                  "
                />


                {/* =============================================
                    VOICE SEARCH
                ============================================== */}

                <button
                  type="button"
                  className="
                    hidden sm:flex
                    items-center justify-center
                    w-11 h-full
                    text-slate-500
                    dark:text-slate-400
                    hover:text-blue-600
                    dark:hover:text-blue-400
                    transition-colors
                  "
                  title="Voice search"
                >

                  <Mic size={20} />

                </button>


                {/* =============================================
                    IMAGE SEARCH
                ============================================== */}

                <button
                  type="button"
                  className="
                    hidden sm:flex
                    items-center justify-center
                    w-11 h-full
                    text-slate-500
                    dark:text-slate-400
                    hover:text-blue-600
                    dark:hover:text-blue-400
                    transition-colors
                  "
                  title="Search by image"
                >

                  <Camera size={20} />

                </button>


                {/* =============================================
                    SEARCH BUTTON
                ============================================== */}

                <button
                  type="submit"
                  className="
                    h-full w-14
                    bg-blue-600
                    text-white
                    flex items-center justify-center
                    hover:bg-blue-700
                    dark:bg-blue-500
                    dark:hover:bg-blue-600
                    transition-colors
                  "
                >

                  <Search size={22} />

                </button>

              </div>

            </form>


            {/* =================================================
                THEME TOGGLE
            ================================================== */}

            <div className="flex-shrink-0">

              <ThemeToggle />

            </div>


            {/* =================================================
                ACCOUNT
            ================================================== */}

            <div className="relative hidden md:block">

              <button
                type="button"
                onClick={() =>
                  setAccountOpen(
                    !accountOpen
                  )
                }
                className="
                  flex items-center gap-2
                  px-3 py-2
                  rounded-lg
                  hover:bg-slate-100
                  dark:hover:bg-slate-900
                  transition-colors
                "
              >

                <User
                  size={23}
                  className="
                    text-slate-800
                    dark:text-slate-200
                  "
                />


                <div className="text-left">

                  <p className="
                    text-[11px]
                    text-slate-500
                    dark:text-slate-400
                    leading-none
                  ">
                    Hello, sign in
                  </p>


                  <div className="flex items-center gap-1">

                    <span className="
                      text-sm font-bold
                      text-slate-900
                      dark:text-slate-100
                    ">
                      Account
                    </span>

                    <ChevronDown
                      size={14}
                      className="
                        text-slate-500
                        dark:text-slate-400
                      "
                    />

                  </div>

                </div>

              </button>


              {/* Account Dropdown */}

              <AnimatePresence>

                {accountOpen && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -5,
                    }}
                    className="
                      absolute top-full right-0
                      mt-2 w-52
                      bg-white
                      dark:bg-slate-900
                      rounded-xl
                      border border-slate-200
                      dark:border-slate-700
                      shadow-xl
                      dark:shadow-black/40
                      p-2
                      z-[60]
                    "
                  >


                    <Link
                      to="/profile"
                      onClick={() =>
                        setAccountOpen(
                          false
                        )
                      }
                      className="
                        block
                        px-3 py-3
                        rounded-lg
                        text-sm font-medium
                        text-slate-800
                        dark:text-slate-100
                        hover:bg-slate-100
                        dark:hover:bg-slate-800
                        transition-colors
                      "
                    >

                      👤 My Profile

                    </Link>


                    <button
                      type="button"
                      className="
                        w-full text-left
                        px-3 py-3
                        rounded-lg
                        text-sm
                        text-slate-700
                        dark:text-slate-200
                        hover:bg-slate-100
                        dark:hover:bg-slate-800
                        transition-colors
                      "
                    >

                      ❤️ Wishlist

                    </button>


                    <button
                      type="button"
                      className="
                        w-full text-left
                        px-3 py-3
                        rounded-lg
                        text-sm
                        text-slate-700
                        dark:text-slate-200
                        hover:bg-slate-100
                        dark:hover:bg-slate-800
                        transition-colors
                      "
                    >

                      📦 My Orders

                    </button>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>


            {/* =================================================
                CART
            ================================================== */}

            <Link
              to="/cart"
              className="
                relative
                flex items-center gap-2
                px-3 py-2
                rounded-lg
                hover:bg-slate-100
                dark:hover:bg-slate-900
                transition-colors
                flex-shrink-0
              "
            >

              <ShoppingCart
                size={27}
                className="
                  text-slate-900
                  dark:text-slate-100
                "
              />


              <span className="
                hidden lg:block
                font-medium
                text-slate-900
                dark:text-slate-100
              ">
                Cart
              </span>


              {/* Cart Count */}

              {cartCount > 0 && (

                <span className="
                  absolute -top-1 -right-1
                  min-w-[20px] h-[20px]
                  px-1 rounded-full
                  bg-red-500
                  text-white
                  text-[11px] font-bold
                  flex items-center justify-center
                  border-2
                  border-white
                  dark:border-slate-950
                ">

                  {cartCount}

                </span>

              )}

            </Link>

          </div>


          {/* =====================================================
              CATEGORY NAVIGATION
          ====================================================== */}

          <div className="
            h-[52px]
            flex items-center gap-8
            overflow-x-auto
            border-t
            border-slate-100
            dark:border-slate-800
            scrollbar-hide
          ">

            {categories.map(
              (cat) => (

                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(
                      cat.id
                    )
                  }
                  className="
                    flex-shrink-0
                    flex items-center gap-2
                    text-sm font-medium
                    text-slate-700
                    dark:text-slate-300
                    hover:text-blue-600
                    dark:hover:text-blue-400
                    transition-colors
                  "
                >

                  <span className="text-lg">
                    {cat.icon}
                  </span>

                  {cat.name}

                </button>

              )
            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          LOCATION MODAL
      ====================================================== */}

      <LocationModal
        open={locationOpen}
        onClose={() =>
          setLocationOpen(false)
        }
      />

    </>

  );

};


export default Navbar;