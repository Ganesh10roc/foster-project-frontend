import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useCart();
  const orderData = location.state || {
    orderTotal: 339.99,
    deliveryTime: "30-45 minutes",
    itemCount: 3,
  };

  useEffect(() => {
    // Auto-redirect to home after 5 seconds if no order data
    const timer = setTimeout(() => {
      if (!location.state) {
        navigate("/home", { replace: true });
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{contain: 'layout style paint'}}>
        <div className="absolute -top-40 -right-40 sm:-top-48 sm:-right-48 lg:-top-64 lg:-right-64 w-96 h-96 bg-green-500/10 rounded-full blur-2xl will-change-transform"></div>
        <div className="absolute -bottom-40 -left-40 sm:-bottom-48 sm:-left-48 lg:-bottom-64 lg:-left-64 w-96 h-96 bg-orange-400/5 rounded-full blur-2xl will-change-transform"></div>
      </div>

      {/* Header */}
      <div className="relative z-40 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-black text-white">Order Confirmation</h1>
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

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto w-full flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12 w-full">

          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="text-7xl md:text-8xl mb-6 animate-bounce">
              ✅
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Order Confirmed!
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              Your delicious food is on the way
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">

            {/* Order ID */}
            <div className="text-center mb-8 pb-8 border-b border-slate-700/50">
              <p className="text-slate-400 text-sm md:text-base mb-2">Order ID</p>
              <p className="text-white font-black text-2xl md:text-3xl">
                #ORD{Math.random().toString(36).substring(7).toUpperCase()}
              </p>
            </div>

            {/* Order Details */}
            <div className="space-y-6 mb-8 pb-8 border-b border-slate-700/50">

              {/* Items Count */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛍️</span>
                  <div>
                    <p className="text-slate-300 text-sm">Items Ordered</p>
                    <p className="text-white font-bold text-lg">{orderData.itemCount} items</p>
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <p className="text-slate-300 text-sm">Estimated Delivery</p>
                    <p className="text-white font-bold text-lg">{orderData.deliveryTime}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="text-slate-300 text-sm">Delivery Address</p>
                    <p className="text-white font-bold text-sm md:text-base">Your registered address</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-8 pb-8 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Subtotal</span>
                <span className="text-white font-bold">₹{(orderData.subtotal || (orderData.orderTotal - (orderData.tax || 0))).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Delivery Fee</span>
                <span className="text-green-300 font-bold">{orderData.deliveryFee === 0 ? 'FREE' : `₹${orderData.deliveryFee}`}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Taxes & Charges</span>
                <span className="text-white font-bold">₹{(orderData.tax || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-white font-bold text-lg">Total Amount</span>
              <span className="text-3xl font-black text-green-400">₹{orderData.orderTotal.toFixed(2)}</span>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-300 font-semibold text-sm md:text-base">
                ✓ Payment Successful • Order Confirmed
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/home")}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
            >
              🏪 Continue Shopping
            </button>

            <button
              onClick={() => navigate("/home")}
              className="w-full px-6 py-4 bg-slate-800/50 border border-slate-700 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all duration-200 cursor-pointer"
            >
              📱 Track Your Order
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm md:text-base mb-3">
              Thank you for ordering with Fastor!
            </p>
            <p className="text-slate-500 text-xs md:text-sm">
              Check email for order details and tracking updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
