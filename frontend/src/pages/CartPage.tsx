import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useStore } from "@/store/useStore";

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  } = useStore();

  /* =====================================================
     CART TOTALS
  ===================================================== */

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const deliveryCharge =
    subtotal > 999 || subtotal === 0
      ? 0
      : 49;

  const total = subtotal + deliveryCharge;

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-accent flex items-center justify-center">
            <ShoppingCart
              size={42}
              className="text-primary"
            />
          </div>

          <h1 className="text-2xl font-bold text-foreground mt-6">
            Your cart is empty
          </h1>

          <p className="text-muted-foreground mt-2">
            Add products from the comparison page
            to see them here.
          </p>

          <Link to="/home">
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <ShoppingBag size={18} />
              Start Shopping
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  /* =====================================================
     CART PAGE
  ===================================================== */

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1200px] mx-auto px-4 py-7">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div>
            <Link
              to="/home"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-3 transition-colors"
            >
              <ArrowLeft size={15} />
              Continue Shopping
            </Link>

            <h1 className="text-3xl font-bold text-foreground">
              Shopping Cart
            </h1>

            <p className="text-sm text-muted-foreground mt-1">
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-2 self-start sm:self-auto text-sm font-medium text-destructive hover:opacity-80 transition-opacity"
          >
            <Trash2 size={16} />
            Clear Cart
          </button>

        </div>

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="space-y-4">

            {cart.map((item, index) => {

              const itemTotal =
                item.price * item.quantity;

              return (
                <motion.div
                  key={`${item.product.id}-${item.platform}`}
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
                  className="bg-card text-card-foreground rounded-xl border border-border p-4 md:p-5 shadow-soft"
                >

                  <div className="flex flex-col sm:flex-row gap-4">

                    {/* PRODUCT IMAGE */}

                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">

                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}

                    </div>

                    {/* PRODUCT INFO */}

                    <div className="flex-1">

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                        <div>
                          <h2 className="font-bold text-foreground">
                            {item.product.name}
                          </h2>

                          <p className="text-sm text-muted-foreground mt-1">
                            {item.product.category}
                          </p>

                          <div className="inline-flex items-center mt-2 px-2.5 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                            {item.platform}
                          </div>
                        </div>

                        {/* PRICE */}

                        <div className="text-left sm:text-right">

                          <p className="text-xl font-bold text-foreground">
                            ₹
                            {item.price.toLocaleString()}
                          </p>

                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              ₹
                              {item.price.toLocaleString()}{" "}
                              × {item.quantity}
                            </p>
                          )}

                        </div>

                      </div>

                      {/* BOTTOM */}

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">

                        {/* QUANTITY */}

                        <div className="flex items-center border border-border rounded-lg overflow-hidden bg-background">

                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.platform,
                                item.quantity - 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="w-10 text-center text-sm font-semibold text-foreground">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.product.id,
                                item.platform,
                                item.quantity + 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus size={15} />
                          </button>

                        </div>

                        {/* ITEM TOTAL */}

                        <div className="text-sm text-muted-foreground">
                          Item total:{" "}

                          <span className="font-bold text-foreground">
                            ₹
                            {itemTotal.toLocaleString()}
                          </span>
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.product.id,
                              item.platform
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-sm text-destructive hover:opacity-80 transition-opacity"
                        >
                          <Trash2 size={15} />
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                </motion.div>
              );
            })}

          </div>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <div>

            <div className="bg-card text-card-foreground rounded-xl border border-border p-5 sticky top-24 shadow-soft">

              <h2 className="text-xl font-bold text-foreground">
                Order Summary
              </h2>

              {/* PRICE */}

              <div className="space-y-3 mt-6">

                <div className="flex justify-between text-sm">

                  <span className="text-muted-foreground">
                    Subtotal
                  </span>

                  <span className="font-medium text-foreground">
                    ₹
                    {subtotal.toLocaleString()}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-muted-foreground">
                    Delivery
                  </span>

                  <span
                    className={
                      deliveryCharge === 0
                        ? "font-medium text-success"
                        : "font-medium text-foreground"
                    }
                  >
                    {deliveryCharge === 0
                      ? "FREE"
                      : `₹${deliveryCharge}`}
                  </span>

                </div>

                <div className="border-t border-border pt-4 flex justify-between">

                  <span className="font-bold text-foreground">
                    Total
                  </span>

                  <span className="text-xl font-bold text-foreground">
                    ₹
                    {total.toLocaleString()}
                  </span>

                </div>

              </div>

              {/* FREE DELIVERY */}

              {subtotal > 0 &&
                subtotal < 999 && (
                  <div className="mt-5 p-3 rounded-lg bg-success/10 border border-success/20">

                    <p className="text-xs text-success">
                      Add ₹
                      {(999 - subtotal).toLocaleString()}{" "}
                      more to get FREE delivery.
                    </p>

                  </div>
                )}

              {subtotal >= 999 && (
                <div className="mt-5 p-3 rounded-lg bg-success/10 border border-success/20">

                  <div className="flex items-center gap-2 text-success">

                    <Truck size={16} />

                    <span className="text-xs font-semibold">
                      You have FREE delivery
                    </span>

                  </div>

                </div>
              )}

              {/* CHECKOUT */}

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Checkout will be available soon."
                  )
                }
                className="w-full mt-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>

              {/* TRUST */}

              <div className="mt-5 pt-5 border-t border-border space-y-3">

                <div className="flex items-center gap-2 text-xs text-muted-foreground">

                  <ShieldCheck
                    size={16}
                    className="text-success"
                  />

                  Secure checkout
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">

                  <Truck
                    size={16}
                    className="text-primary"
                  />

                  Compare delivery options
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;