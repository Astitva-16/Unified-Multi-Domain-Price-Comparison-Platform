import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/mockData";

/* =====================================================
   CART ITEM
===================================================== */

export interface CartItem {
  product: Product;
  platform: string;
  price: number;
  quantity: number;
  platformUrl?: string;
}

/* =====================================================
   WISHLIST ITEM
===================================================== */

export interface WishlistItem {
  product: Product;
}

/* =====================================================
   APP STATE
===================================================== */

interface AppState {
  /* -----------------------------
     Existing state
  ----------------------------- */

  selectedCategory: string | null;

  searchQuery: string;

  isDark: boolean;

  location: string;

  /* -----------------------------
     Cart state
  ----------------------------- */

  cart: CartItem[];

  /* -----------------------------
     Wishlist state
  ----------------------------- */

  wishlist: WishlistItem[];

  /* -----------------------------
     Existing actions
  ----------------------------- */

  setSelectedCategory: (
    cat: string | null
  ) => void;

  setSearchQuery: (
    q: string
  ) => void;

  toggleDark: () => void;

  setLocation: (
    location: string
  ) => void;

  /* -----------------------------
     Cart actions
  ----------------------------- */

  addToCart: (
    product: Product,
    platform: string,
    price: number,
    platformUrl?: string
  ) => void;

  removeFromCart: (
    productId: string,
    platform: string
  ) => void;

  updateCartQuantity: (
    productId: string,
    platform: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  /* -----------------------------
     Wishlist actions
  ----------------------------- */

  addToWishlist: (
    product: Product
  ) => void;

  removeFromWishlist: (
    productId: string
  ) => void;

  toggleWishlist: (
    product: Product
  ) => void;

  isInWishlist: (
    productId: string
  ) => boolean;
}

/* =====================================================
   STORE
===================================================== */

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({

      /* =================================================
         EXISTING STATE
      ================================================= */

      selectedCategory: null,

      searchQuery: "",

      isDark: false,

      location: "",

      /* =================================================
         CART
      ================================================= */

      cart: [],

      /* =================================================
         WISHLIST
      ================================================= */

      wishlist: [],

      /* =================================================
         EXISTING ACTIONS
      ================================================= */

      setSelectedCategory: (cat) =>
        set({
          selectedCategory: cat,
        }),

      setSearchQuery: (q) =>
        set({
          searchQuery: q,
        }),

      /* =================================================
         LOCATION
      ================================================= */

      setLocation: (location) =>
        set({
          location,
        }),

      /* =================================================
         DARK MODE
      ================================================= */

      toggleDark: () =>
        set((state) => {

          const next =
            !state.isDark;

          document.documentElement.classList.toggle(
            "dark",
            next
          );

          return {
            isDark: next,
          };

        }),

      /* =================================================
         ADD TO CART
      ================================================= */

      addToCart: (
        product,
        platform,
        price,
        platformUrl
      ) =>
        set((state) => {

          const existingItem =
            state.cart.find(
              (item) =>
                item.product.id === product.id &&
                item.platform === platform
            );

          if (existingItem) {

            return {

              cart: state.cart.map(
                (item) =>

                  item.product.id === product.id &&
                  item.platform === platform

                    ? {
                        ...item,
                        quantity:
                          item.quantity + 1,
                      }

                    : item
              ),

            };

          }

          return {

            cart: [

              ...state.cart,

              {
                product,
                platform,
                price,
                quantity: 1,
                platformUrl,
              },

            ],

          };

        }),

      /* =================================================
         REMOVE FROM CART
      ================================================= */

      removeFromCart: (
        productId,
        platform
      ) =>
        set((state) => ({

          cart: state.cart.filter(
            (item) =>

              !(
                item.product.id === productId &&
                item.platform === platform
              )

          ),

        })),

      /* =================================================
         UPDATE CART QUANTITY
      ================================================= */

      updateCartQuantity: (
        productId,
        platform,
        quantity
      ) =>
        set((state) => {

          if (quantity <= 0) {

            return {

              cart: state.cart.filter(
                (item) =>

                  !(
                    item.product.id === productId &&
                    item.platform === platform
                  )

              ),

            };

          }

          return {

            cart: state.cart.map(
              (item) =>

                item.product.id === productId &&
                item.platform === platform

                  ? {
                      ...item,
                      quantity,
                    }

                  : item

            ),

          };

        }),

      /* =================================================
         CLEAR CART
      ================================================= */

      clearCart: () =>
        set({
          cart: [],
        }),

      /* =================================================
         ADD TO WISHLIST
      ================================================= */

      addToWishlist: (
        product
      ) =>
        set((state) => {

          const alreadyExists =
            state.wishlist.some(
              (item) =>
                item.product.id ===
                product.id
            );

          if (alreadyExists) {
            return state;
          }

          return {

            wishlist: [
              ...state.wishlist,
              {
                product,
              },
            ],

          };

        }),

      /* =================================================
         REMOVE FROM WISHLIST
      ================================================= */

      removeFromWishlist: (
        productId
      ) =>
        set((state) => ({

          wishlist:
            state.wishlist.filter(
              (item) =>
                item.product.id !==
                productId
            ),

        })),

      /* =================================================
         TOGGLE WISHLIST
      ================================================= */

      toggleWishlist: (
        product
      ) =>
        set((state) => {

          const alreadyExists =
            state.wishlist.some(
              (item) =>
                item.product.id ===
                product.id
            );

          if (alreadyExists) {

            return {

              wishlist:
                state.wishlist.filter(
                  (item) =>
                    item.product.id !==
                    product.id
                ),

            };

          }

          return {

            wishlist: [
              ...state.wishlist,
              {
                product,
              },
            ],

          };

        }),

      /* =================================================
         CHECK WISHLIST
      ================================================= */

      isInWishlist: (
        productId
      ) => {

        return get()
          .wishlist
          .some(
            (item) =>
              item.product.id ===
              productId
          );

      },

    }),

    /* ===================================================
       PERSIST CONFIG
    =================================================== */

    {
      name: "mol-bhao-storage",

      partialize: (state) => ({

        cart: state.cart,

        wishlist:
          state.wishlist,

        location:
          state.location,

      }),

    }

  )
);