import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const navigate = useNavigate();
  // FIX: CartContext exports 'items', not 'cartItems'
  const { items: cartItems, cartCount, removeFromCart, logout } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Calculate actual order total from cart items
  // SECURITY: Calculate on server-side only for production
  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const itemPrice = item.price || 299.99 / (cartCount || 1);
      const itemTotal = itemPrice * (item.quantity || 1);
      return sum + itemTotal;
    }, 0);
  };

  const subtotal = parseFloat(calculateSubtotal().toFixed(2));
  const deliveryFee = 0; // Free delivery
  const taxRate = 0.134; // 13.4% GST
  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const orderTotal = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

  const handleCheckout = async () => {
    if (cartCount === 0) {
      setCheckoutError("Your cart is empty. Please add items first.");
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError("");
    setCheckoutSuccess(false);

    try {
      // SECURITY: Server should validate total, not trust client
      // In production: Send cartItems to server, server calculates total
      // Prevent price manipulation attacks

      // Simulate API call (replace with actual API in future)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCheckoutSuccess(true);
      setCheckoutError("");

      // Navigate to success page after brief delay
      setTimeout(() => {
        navigate("/order-confirmation", {
          state: {
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            tax: tax,
            orderTotal: orderTotal,
            deliveryTime: "30-45 minutes",
            itemCount: cartCount,
          },
        });
      }, 500);
    } catch (err) {
      setCheckoutError(err.message || "Checkout failed. Please try again.");
      setCheckoutSuccess(false);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{contain: 'layout style paint'}}>
        <div className="absolute -top-40 -right-40 sm:-top-48 sm:-right-48 lg:-top-64 lg:-right-64 w-96 h-96 bg-orange-500/10 rounded-full blur-2xl will-change-transform"></div>
        <div className="absolute -bottom-40 -left-40 sm:-bottom-48 sm:-left-48 lg:-bottom-64 lg:-left-64 w-96 h-96 bg-orange-400/5 rounded-full blur-2xl will-change-transform"></div>
      </div>

      {/* Header */}
      <div className="relative z-40 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/home")}
                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold transition-colors group cursor-pointer text-sm"
              >
                <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
                <span>Back</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-black text-white ml-4">🛒 Cart</h1>
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/signup");
              }}
              className="px-3 md:px-4 py-2.5 md:py-3 text-slate-300 hover:text-orange-300 font-semibold text-xs md:text-sm transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto w-full">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">

          {cartCount === 0 ? (
            // Empty Cart State
            <div className="text-center py-16">
              <div className="text-5xl md:text-7xl mb-6">🛒</div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4">Your Cart is Empty</h2>
              <p className="text-slate-400 text-base md:text-lg mb-8">
                Start adding delicious food from your favorite restaurants
              </p>

              <button
                onClick={() => navigate("/home")}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                🏪 Browse Restaurants
              </button>

              {/* Promotional Info */}
              <div className="mt-12 bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6 md:p-8">
                <h3 className="text-white font-bold mb-3">Why Order with Fastor?</h3>
                <div className="text-left space-y-2 text-slate-300 text-sm">
                  <p>✓ <span className="text-orange-400 font-semibold">30-45 min</span> fast delivery</p>
                  <p>✓ <span className="text-orange-400 font-semibold">Free delivery</span> on all orders</p>
                  <p>✓ <span className="text-orange-400 font-semibold">100+ restaurants</span> to choose from</p>
                  <p>✓ <span className="text-orange-400 font-semibold">Secure payment</span> options</p>
                </div>
              </div>
            </div>
          ) : (
            // Cart with Items
            <div>
              <h2 className="text-2xl font-black text-white mb-6">
                {cartCount} item{cartCount !== 1 ? "s" : ""} in cart
              </h2>

              <div className="space-y-4 mb-8">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 md:p-5 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-base md:text-lg">{item.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">Qty: {item.qty || 1}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg font-semibold hover:bg-red-600/40 transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center">No items in cart</p>
                )}
              </div>

              {/* Checkout Button */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 sticky bottom-0">
                <div className="mb-6 pb-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-300">Subtotal</span>
                    <span className="text-white font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-300">Delivery Fee</span>
                    <span className="text-green-300 font-bold">FREE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Taxes (13.4% GST)</span>
                    <span className="text-white font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-2xl font-black text-orange-400">₹{orderTotal.toFixed(2)}</span>
                </div>

                {/* Error Message */}
                {checkoutError && (
                  <div className="mb-4 bg-red-500/10 border-l-4 border-red-500 rounded-lg px-4 py-3 animate-shake">
                    <div className="flex gap-3">
                      <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
                      <p className="text-red-300 text-sm font-medium">{checkoutError}</p>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {checkoutSuccess && (
                  <div className="mb-4 bg-green-500/10 border-l-4 border-green-500 rounded-lg px-4 py-3 animate-fadeIn">
                    <div className="flex gap-3">
                      <span className="text-green-400 text-lg flex-shrink-0">✓</span>
                      <p className="text-green-300 text-sm font-medium">Processing your order...</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cartCount === 0}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 cursor-pointer shadow-lg ${
                    checkoutLoading || cartCount === 0
                      ? "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
                  }`}
                >
                  {checkoutLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-block w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Processing...</span>
                    </div>
                  ) : cartCount === 0 ? (
                    "Add items to checkout"
                  ) : (
                    <>
                      💳 Proceed to Checkout →
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
