import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { fetchRestaurants, DEFAULT_CITY_ID } from "../services/api.js";
import { getRestaurantImage } from "../services/imageHelper.js";
import SkeletonCard from "../components/SkeletonCard.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { token, isAuthenticated, profile, cartCount, logout, expireSession } =
    useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [imageLoaded, setImageLoaded] = useState(new Set());
  const [imageError, setImageError] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup", { replace: true });
      return;
    }

    let cancelled = false;
    setStatus("loading");

    fetchRestaurants({ token, cityId: DEFAULT_CITY_ID })
      .then(({ restaurants: list }) => {
        if (cancelled) return;
        setRestaurants(list);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.isAuthError) {
          expireSession();
          navigate("/signup", { replace: true });
          return;
        }
        setErrorMsg(err.message || "Could not load restaurants.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, isAuthenticated]);

  const filtered = query.trim()
    ? restaurants.filter((r) =>
        r.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : restaurants;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 4.5) - (a.rating || 4.5);
    if (sortBy === "delivery") return 45 - 30; // Placeholder
    return 0;
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{contain: 'layout style paint'}}>
        <div className="absolute -top-40 -right-40 sm:-top-48 sm:-right-48 lg:-top-64 lg:-right-64 w-96 h-96 bg-orange-500/10 rounded-full blur-2xl will-change-transform"></div>
        <div className="absolute -bottom-40 -left-40 sm:-bottom-48 sm:-left-48 lg:-bottom-64 lg:-left-64 w-96 h-96 bg-orange-400/5 rounded-full blur-2xl will-change-transform"></div>
      </div>

      {/* Sticky Header */}
      <div className="relative z-40 border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-xl shrink-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6">
          {/* Logo Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg md:text-xl">🍽️</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">Fastor</h1>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => navigate("/cart")}
                className="px-3 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-bold text-xs md:text-sm hover:shadow-lg hover:shadow-orange-500/40 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
              >
                🛒 Cart {cartCount > 0 && `(${cartCount})`}
              </button>
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

          {/* Search Bar */}
          <div className="relative group mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-300"></div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search restaurants, cuisines..."
              className="relative w-full bg-slate-700/30 border border-slate-600/60 rounded-xl px-4 py-3 md:py-3.5 text-white placeholder-slate-500/60 text-sm md:text-base focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30 transition-all duration-200 backdrop-blur-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          {/* Filter & Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold">Sort by:</span>
            <button
              onClick={() => setSortBy("rating")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                sortBy === "rating"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/40"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
              }`}
            >
              ⭐ Rating
            </button>
            <button
              onClick={() => setSortBy("delivery")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                sortBy === "delivery"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/40"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600"
              }`}
            >
              🚚 Delivery Time
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 md:py-12">

          {/* Promotional Banner */}
          {status === "ready" && (
            <div className="mb-10 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 rounded-2xl p-6 md:p-8 shadow-2xl shadow-orange-500/30 relative overflow-hidden cursor-pointer hover:shadow-orange-500/50 transition-all duration-300">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 text-8xl">🍕</div>
                <div className="absolute bottom-0 left-0 text-8xl">🍔</div>
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-black text-white mb-2">
                  🎉 Order Now!
                </h2>
                <p className="text-white/90 text-sm md:text-base font-medium">
                  Get your favorite food delivered in 30-45 minutes
                </p>
              </div>
            </div>
          )}

          {status === "loading" && (
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white mb-6">
                Loading Restaurants...
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))}
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-16">
              <p className="text-white text-lg md:text-xl font-bold mb-2">Could not load restaurants</p>
              <p className="text-slate-400 text-sm md:text-base mb-6">{errorMsg}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {status === "ready" && filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 text-base font-medium">No restaurants match your search</p>
            </div>
          )}

          {status === "ready" && sorted.length > 0 && (
            <div>
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-black text-white">
                  All Restaurants
                </h2>
                <p className="text-slate-400 text-sm md:text-base mt-1">
                  {sorted.length} restaurant{sorted.length !== 1 ? "s" : ""} available
                </p>
              </div>

              {/* Restaurant Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {sorted.map((r, idx) => {
                  const imgSrc = getRestaurantImage(r, idx);
                  return (
                    <div
                      key={r.id}
                      className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:border-orange-500/30 hover:scale-105 cursor-pointer"
                      onClick={() => navigate(`/item/${r.id}`, { state: { restaurant: r } })}
                    >
                      {/* Image Container */}
                      <div className="relative w-full h-48 md:h-56 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">

                        {/* Loading Skeleton */}
                        {!imageLoaded.has(r.id) && !imageError.has(r.id) && (
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 animate-pulse" />
                        )}

                        {/* Actual Image */}
                        {!imageError.has(r.id) && (
                          <img
                            src={imgSrc}
                            alt={r.name}
                            loading="lazy"
                            onLoad={() => setImageLoaded(prev => new Set([...prev, r.id]))}
                            onError={() => setImageError(prev => new Set([...prev, r.id]))}
                            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-300 ${
                              imageLoaded.has(r.id) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        )}

                        {/* Fallback - Shown if image fails */}
                        {imageError.has(r.id) && (
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-5xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
                            🍽️
                          </div>
                        )}

                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full shadow-lg">
                          <span className="text-sm font-bold text-slate-900">⭐ 4.5</span>
                        </div>

                        {/* Offer Badge (if applicable) */}
                        <div className="absolute top-3 left-3 bg-orange-600/90 backdrop-blur px-2.5 py-1 rounded-full shadow-lg">
                          <span className="text-xs font-bold text-white">🎯 Premium</span>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/item/${r.id}`, { state: { restaurant: r } });
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
                          >
                            View Menu →
                          </button>
                        </div>
                      </div>

                      {/* Info Card - Enhanced visibility */}
                      <div className="p-4 md:p-5 space-y-2.5 bg-gradient-to-b from-slate-800/50 to-slate-900/80 backdrop-blur-sm">

                        {/* Restaurant Name - Prominent */}
                        <div className="min-h-20">
                          <h3 className="font-black text-white text-base md:text-lg group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
                            {r.name}
                          </h3>
                          {r.address && (
                            <p className="text-slate-400 text-xs md:text-sm mt-2 line-clamp-1">
                              📍 {r.address}
                            </p>
                          )}
                        </div>

                        {/* Delivery & Price Info - Bold & Clear */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="text-xs font-black bg-slate-700/70 text-orange-300 px-2.5 py-1.5 rounded-lg">🚚 30-45 min</span>
                          <span className="text-xs font-black bg-green-900/60 text-green-200 px-2.5 py-1.5 rounded-lg">✓ Free Delivery</span>
                        </div>

                        {/* Cuisine Type */}
                        <p className="text-xs text-slate-300 font-medium">
                          🍽️ Multi-Cuisine
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
