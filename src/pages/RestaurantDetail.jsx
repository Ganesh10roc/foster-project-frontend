import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { fetchRestaurants, DEFAULT_CITY_ID } from "../services/api.js";
import { getRestaurantImage } from "../services/imageHelper.js";

export default function RestaurantDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, isAuthenticated, expireSession } = useCart();

  const [restaurant, setRestaurant] = useState(location.state?.restaurant ?? null);
  const [status, setStatus] = useState(restaurant ? "ready" : "loading");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (restaurant) return;
    if (!isAuthenticated) {
      navigate("/home", { replace: true });
      return;
    }

    let cancelled = false;
    fetchRestaurants({ token, cityId: DEFAULT_CITY_ID })
      .then(({ restaurants: list }) => {
        if (cancelled) return;
        setRestaurant(list.find((r) => String(r.id) === String(id)) ?? null);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.isAuthError) {
          expireSession();
          navigate("/home", { replace: true });
          return;
        }
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [restaurant, token, isAuthenticated, id, navigate, expireSession]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl font-bold mb-4">Restaurant not found</p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 cursor-pointer"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Background decorative elements - Optimized for no scroll */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{contain: 'layout style paint'}}>
        <div className="absolute -top-32 -right-32 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-80 sm:h-80 bg-orange-500/10 rounded-full blur-2xl will-change-transform"></div>
        <div className="absolute -bottom-32 -left-32 sm:-bottom-40 sm:-left-40 w-64 h-64 sm:w-80 sm:h-80 bg-orange-400/5 rounded-full blur-2xl will-change-transform"></div>
      </div>

      {/* Professional Header */}
      <div className="relative border-b border-slate-700/50 bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-5 md:py-6">

          {/* Back Button Row */}
          <div className="mb-3">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-bold transition-all duration-200 group cursor-pointer text-sm md:text-base"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span>Back to Restaurants</span>
            </button>
          </div>

          {/* Restaurant Info Row */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight break-words">
                {restaurant.name}
              </h1>

              {/* Location & Cuisine */}
              <div className="flex items-center gap-2 flex-wrap text-xs md:text-sm text-slate-400">
                <span>📍 {restaurant.address || "Location available"}</span>
                <span className="text-slate-600">•</span>
                <span>🍽️ Multi-Cuisine</span>
              </div>
            </div>

            {/* Rating & Status Pills */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur text-slate-900 px-3 py-2 rounded-full font-bold shadow-lg">
                <span>⭐</span>
                <span className="text-sm md:text-base">4.5</span>
              </div>
              <div className="flex items-center gap-2 bg-green-900/40 border border-green-500/30 text-green-300 px-3 py-2 rounded-full font-semibold text-xs md:text-sm shadow-lg">
                <span>●</span>
                <span>Open Now</span>
              </div>
            </div>
          </div>

          {/* Key Info Badges */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs font-bold bg-slate-700/50 text-slate-200 px-3 py-1.5 rounded-lg">🚚 30-45 min delivery</span>
            <span className="text-xs font-bold bg-green-900/40 text-green-300 px-3 py-1.5 rounded-lg">✓ Free delivery</span>
            <span className="text-xs font-bold bg-orange-600/20 border border-orange-500/30 text-orange-400 px-3 py-1.5 rounded-lg">🌟 Premium Partner</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">
        {/* Card Container */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
          {/* Restaurant Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden rounded-xl">

            {/* Actual Image - Show if loaded successfully */}
            {!imageError && (
              <img
                src={getRestaurantImage(restaurant, 0)}
                alt={restaurant.name}
                loading="eager"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            {/* Loading Skeleton - Show while loading */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
            )}

            {/* Fallback - Show if image fails to load */}
            {imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-7xl md:text-8xl mb-4">🍽️</div>
                  <p className="text-white/80 text-sm font-medium">Restaurant Image</p>
                </div>
              </div>
            )}
          </div>

          {/* Restaurant Info */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Name and Rating */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {restaurant.name}
              </h2>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-semibold">
                  🌟 Premium
                </span>
                <span className="text-slate-400 text-sm">Quick delivery available</span>
              </div>
            </div>

            {/* Address */}
            {restaurant.address && (
              <div className="border-t border-slate-700/50 pt-6">
                <h3 className="text-orange-400 font-semibold mb-2">Location</h3>
                <p className="text-slate-300 leading-relaxed">{restaurant.address}</p>
              </div>
            )}

            {/* Description */}
            <div className="border-t border-slate-700/50 pt-6">
              <h3 className="text-orange-400 font-semibold mb-3">About</h3>
              <p className="text-slate-300 leading-relaxed">
                Discover delicious food and excellent service at {restaurant.name}. We offer a
                wide variety of high-quality dishes prepared with fresh ingredients.
              </p>
            </div>

            {/* Info Grid */}
            <div className="border-t border-slate-700/50 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">4.5</p>
                <p className="text-xs text-slate-400 mt-1">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">30-45</p>
                <p className="text-xs text-slate-400 mt-1">Min Delivery</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">Free</p>
                <p className="text-xs text-slate-400 mt-1">Delivery</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-400">Open</p>
                <p className="text-xs text-slate-400 mt-1">Now</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="border-t border-slate-700/50 pt-6">
              <button
                onClick={() => navigate("/home")}
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                🛍️ Start Ordering
              </button>
              <p className="text-center text-slate-400 text-sm mt-4">
                Browse menu items to add to your cart →
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
