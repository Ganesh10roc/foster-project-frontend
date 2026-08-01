import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { fetchRestaurants, DEFAULT_CITY_ID } from "../services/api.js";
import RestaurantImage from "../components/RestaurantImage.jsx";

const PORTIONS = [
  { id: "personal", label: "Personal (4 slices)", extra: 0 },
  { id: "medium", label: "Medium (8 slices)", extra: 3 },
  { id: "familiar", label: "Familiar (10 slices)", extra: 6 },
  { id: "jumbo", label: "Jumbo (12 slices)", extra: 10 },
];

const BASE_PRICE = 14;

export default function ItemDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, isAuthenticated, addToCart, expireSession } = useCart();

  const [restaurant, setRestaurant] = useState(
    location.state?.restaurant ?? null
  );
  const [status, setStatus] = useState(restaurant ? "ready" : "loading");
  const [qty, setQty] = useState(1);
  const [portionId, setPortionId] = useState("jumbo");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (restaurant) return;
    if (!isAuthenticated) {
      navigate("/signup", { replace: true });
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
          navigate("/signup", { replace: true });
          return;
        }
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [restaurant, token, isAuthenticated, id, navigate, expireSession]);

  const portion = PORTIONS.find((p) => p.id === portionId) ?? PORTIONS[0];
  const unitPrice = BASE_PRICE + portion.extra;
  const total = unitPrice * qty;

  const handleAdd = () => {
    if (!restaurant) return;
    addToCart({
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.image,
      portion: portion.id,
      price: unitPrice,
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 font-medium mb-4">Restaurant not found</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-lg font-bold text-gray-900 truncate">
          {restaurant.name}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Hero Image */}
          <div className="w-full h-56 bg-gradient-to-br from-orange-300 to-orange-500 rounded-lg mb-6 flex items-center justify-center text-8xl">
            🍕
          </div>

          {/* Price and Rating */}
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-3xl font-bold text-orange-600">
              ₹{BASE_PRICE.toFixed(2)}
            </h2>
            {restaurant.rating && (
              <span className="text-lg font-medium text-orange-600">
                ★ {restaurant.rating}
              </span>
            )}
          </div>

          {/* Restaurant Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {restaurant.name}
            </h2>
            {restaurant.cuisine && (
              <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
            )}
            {restaurant.address && (
              <p className="text-gray-600 text-xs">{restaurant.address}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-gray-600 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Portion Selection */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              Select Size
            </h3>
            <div className="space-y-2">
              {PORTIONS.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="portion"
                    value={p.id}
                    checked={p.id === portionId}
                    onChange={() => setPortionId(p.id)}
                    className="w-4 h-4 accent-orange-600"
                  />
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium text-sm">
                      {p.label}
                    </p>
                  </div>
                  <p className="text-orange-600 font-bold text-sm">
                    ₹{(BASE_PRICE + p.extra).toFixed(2)}
                  </p>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
              Quantity
            </h3>
            <div className="flex items-center gap-3 w-fit">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 font-bold text-lg transition"
              >
                −
              </button>
              <span className="text-xl font-bold text-gray-900 w-8 text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(20, q + 1))}
                className="w-10 h-10 border-2 border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 font-bold text-lg transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-gray-600">Unit Price</span>
              <span className="text-gray-900 font-medium">
                ₹{unitPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-600">Quantity</span>
              <span className="text-gray-900 font-medium">× {qty}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-bold text-orange-600">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition-all ${
              added
                ? "bg-green-600 hover:bg-green-700"
                : "bg-orange-600 hover:bg-orange-700 active:scale-95"
            }`}
          >
            {added ? "✓ Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
