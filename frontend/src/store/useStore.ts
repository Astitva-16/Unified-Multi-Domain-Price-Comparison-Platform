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
}


/* =====================================================
   STORE
===================================================== */

export const useStore = create<AppState>()(
  persist(
    (set) => ({

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

          /*
            Check whether the same product
            from the same platform already exists.
          */

          const existingItem =
            state.cart.find(
              (item) =>
                item.product.id ===
                  product.id &&
                item.platform ===
                  platform
            );


          /* ---------------------------------------------
             Already exists → increase quantity
          --------------------------------------------- */

          if (existingItem) {

            return {

              cart: state.cart.map(
                (item) =>

                  item.product.id ===
                    product.id &&
                  item.platform ===
                    platform

                    ? {
                        ...item,
                        quantity:
                          item.quantity + 1,
                      }

                    : item
              ),

            };

          }


          /* ---------------------------------------------
             New item
          --------------------------------------------- */

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
                item.product.id ===
                  productId &&
                item.platform ===
                  platform
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

          /*
            If quantity becomes 0,
            remove the item.
          */

          if (quantity <= 0) {

            return {

              cart: state.cart.filter(
                (item) =>

                  !(
                    item.product.id ===
                      productId &&
                    item.platform ===
                      platform
                  )

              ),

            };

          }


          return {

            cart: state.cart.map(
              (item) =>

                item.product.id ===
                  productId &&
                item.platform ===
                  platform

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

    }),


    /* ===================================================
       PERSIST CONFIG
    =================================================== */

    {
      name: "mol-bhao-storage",

      /*
        Only these values are saved
        in localStorage.
      */

      partialize: (state) => ({

        cart: state.cart,

        location: state.location,

      }),

    }

  )
);