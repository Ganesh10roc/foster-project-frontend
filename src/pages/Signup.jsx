import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { registerUser } from "../services/api.js";

export default function Signup() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setPendingPhone } = useCart();

  const handleGetOtp = async () => {
    if (phone.length !== 10 || loading) return;

    // Security: Validate Indian phone number format
    // Valid Indian numbers start with 6-9 (mobile)
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(phone)) {
      setError("Please enter a valid Indian mobile number (starts with 6-9)");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await registerUser({ phone, dialCode: "+91" });
      setPendingPhone(phone, "+91");
      navigate("/verify");
    } catch (err) {
      setError(err.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = phone.length === 10;
  const progress = (phone.length / 10) * 100;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 overflow-x-hidden">
      {/* Premium Animated Background - Optimized for no scroll */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{contain: 'layout style paint'}}>
        {/* Gradient orbs - Sized to prevent overflow */}
        <div className="absolute -top-40 -right-40 sm:-top-48 sm:-right-48 lg:-top-64 lg:-right-64 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-full blur-3xl animate-pulse will-change-transform"></div>
        <div className="absolute -bottom-40 -left-40 sm:-bottom-48 sm:-left-48 lg:-bottom-64 lg:-left-64 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-tr from-orange-600/15 to-transparent rounded-full blur-2xl animate-pulse delay-1000 will-change-transform"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 will-change-auto"></div>
      </div>

      {/* Content - Properly Centered */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">

        {/* Main Container - Desktop Layout */}
        <div className="w-full">
          {/* Desktop: Two Column Layout (lg+) */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-20 max-w-7xl mx-auto items-center">

            {/* LEFT: Hero Section */}
            <div className="flex flex-col justify-center space-y-8 pr-4">
              {/* Logo & Brand */}
              <div className="space-y-4">
                <div className="inline-flex">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🍽️</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tight mb-2">
                    Fastor
                  </h1>
                  <p className="text-xl text-orange-400 font-semibold">Food, Faster, Fresher</p>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="space-y-6">
                <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Your Favorite Food,<br />Delivered in Minutes
                </h2>

                <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                  Order from 500+ restaurants, get instant delivery, and enjoy exclusive deals every day.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-4 pt-4">
                {[
                  { icon: "⚡", title: "Ultra-Fast Delivery", desc: "30-45 minutes or less" },
                  { icon: "🔒", title: "100% Safe", desc: "Secure transactions & fresh food" },
                  { icon: "💰", title: "Best Prices", desc: "Exclusive discounts & offers" },
                  { icon: "⭐", title: "Top Rated", desc: "4.8★ from 50K+ customers" }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-4 group cursor-pointer">
                    <div className="text-2xl mt-1 transform group-hover:scale-125 transition-transform duration-300 flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-sm lg:text-base">{benefit.title}</h3>
                      <p className="text-slate-400 text-xs lg:text-sm">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="pt-8 border-t border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-4">Trusted by millions</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-2 border-slate-900 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                        👤
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-slate-300"><span className="font-bold text-white">50K+</span> Happy Orders</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Sign Up Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                {/* Card */}
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                  {/* Card Content */}
                  <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl">

                    {/* Header */}
                    <div className="mb-8">
                      <h2 className="text-3xl font-black text-white mb-2">Join Now</h2>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Enter your number to get started. We'll send you a verification code.
                      </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">

                      {/* Phone Input Group */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                          Phone Number
                        </label>

                        <div className="flex gap-3">
                          {/* Country Code */}
                          <div className="relative group/code flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-0 group-hover/code:opacity-100 transition duration-300"></div>
                            <div className="relative flex items-center justify-center px-4 py-3.5 bg-slate-700/40 border border-slate-600/60 rounded-xl font-bold text-slate-300 backdrop-blur-sm hover:border-orange-500/40 transition-colors duration-300 whitespace-nowrap text-sm">
                              🇮🇳 +91
                            </div>
                          </div>

                          {/* Phone Input */}
                          <div className="flex-1 relative group/input">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-300"></div>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                if (val.length <= 10) {
                                  setPhone(val);
                                  if (val.length < 10) {
                                    setError("");
                                  }
                                }
                              }}
                              maxLength="10"
                              placeholder="10-digit number"
                              maxLength="10"
                              className="relative w-full bg-slate-700/30 border-2 border-slate-600/60 rounded-xl px-4 py-3.5 text-white placeholder-slate-500/60 font-medium focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm text-lg"
                            />

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-700/30 rounded-b-xl overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 transition-all duration-500 ease-out shadow-lg shadow-orange-500/50"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Helper Text */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-slate-400">
                            {phone.length === 0
                              ? "Enter your mobile number"
                              : `${phone.length}/10 • ${10 - phone.length} more digits`}
                          </p>
                          {isValid && (
                            <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                              ✓ Valid
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <div className="group animate-shake">
                          <div className="relative bg-red-500/10 border-l-4 border-red-500 rounded-lg px-4 py-3 backdrop-blur-sm">
                            <div className="flex gap-3">
                              <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
                              <p className="text-red-300 text-sm font-medium">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <button
                        onClick={handleGetOtp}
                        disabled={!isValid || loading}
                        className={`group relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-base transition-all duration-300 cursor-pointer ${
                          isValid && !loading
                            ? "bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/75 hover:scale-105 active:scale-95"
                            : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {isValid && !loading && (
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}

                        <div className="relative flex items-center justify-center gap-2">
                          {loading ? (
                            <>
                              <span className="inline-block w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                              <span>Sending Code...</span>
                            </>
                          ) : (
                            <>
                              <span className="font-black">🚀 Continue</span>
                              <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </>
                          )}
                        </div>
                      </button>

                      {/* Divider */}
                      <div className="relative py-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-600/30"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="bg-slate-900/80 px-3 text-xs text-slate-400 font-medium">OR</span>
                        </div>
                      </div>

                      {/* Info Box */}
                      <div className="group relative overflow-hidden rounded-xl p-4 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-colors duration-300">
                        <p className="relative text-xs text-blue-300 leading-relaxed font-medium">
                          ✓ Fast & Secure • Your number is safe • SMS rates may apply
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-slate-700/30 space-y-3">
                      <p className="text-xs text-slate-500 text-center leading-relaxed">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold underline transition">
                          Terms
                        </a>
                        {" "}and{" "}
                        <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold underline transition">
                          Privacy
                        </a>
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">🔒</span>
                        <p className="text-xs text-slate-500 font-medium">
                          Enterprise-grade encryption
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2">
                    <span className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} className="text-sm text-amber-400">★</span>
                      ))}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">4.8/5 • 50K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE & TABLET: Single Column Layout (below lg) */}
          <div className="lg:hidden max-w-md mx-auto w-full">
            {/* Mobile Logo */}
            <div className="flex flex-col items-center justify-center space-y-3 mb-8 sm:mb-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl sm:text-4xl">🍽️</span>
              </div>
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-black text-white">Fastor</h1>
                <p className="text-sm sm:text-base text-orange-400 font-semibold">Food, Faster, Fresher</p>
              </div>
            </div>

            {/* Form Card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>

              {/* Card Content */}
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-700/50 shadow-2xl">

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-black text-white mb-1 sm:mb-2">Join Now</h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Enter your number to get started. We'll send you a verification code.
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-5 sm:space-y-6">

                  {/* Phone Input Group */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Phone Number
                    </label>

                    <div className="flex gap-2.5 sm:gap-3">
                      {/* Country Code */}
                      <div className="relative group/code flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg sm:rounded-xl blur opacity-0 group-hover/code:opacity-100 transition duration-300"></div>
                        <div className="relative flex items-center justify-center px-2.5 sm:px-3 py-2.5 sm:py-3 bg-slate-700/40 border border-slate-600/60 rounded-lg sm:rounded-xl font-bold text-slate-300 text-xs sm:text-sm backdrop-blur-sm hover:border-orange-500/40 transition-colors duration-300 whitespace-nowrap">
                          🇮🇳 +91
                        </div>
                      </div>

                      {/* Phone Input */}
                      <div className="flex-1 relative group/input min-w-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg sm:rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-300"></div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            if (val.length <= 10) setPhone(val);
                            setError("");
                          }}
                          placeholder="10-digit number"
                          maxLength="10"
                          className="relative w-full bg-slate-700/30 border-2 border-slate-600/60 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500/60 font-medium focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm text-base sm:text-lg"
                        />

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700/30 rounded-b-lg sm:rounded-b-xl overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 transition-all duration-500 ease-out shadow-lg shadow-orange-500/50"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Helper Text */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-slate-400 truncate">
                        {phone.length === 0
                          ? "Enter your mobile number"
                          : `${phone.length}/10 digits`}
                      </p>
                      {isValid && (
                        <span className="text-xs font-bold text-green-400 flex-shrink-0">✓</span>
                      )}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="group animate-shake">
                      <div className="relative bg-red-500/10 border-l-4 border-red-500 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 backdrop-blur-sm">
                        <div className="flex gap-2 sm:gap-3">
                          <span className="text-red-400 text-base sm:text-lg flex-shrink-0">⚠️</span>
                          <p className="text-red-300 text-xs sm:text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleGetOtp}
                    disabled={!isValid || loading}
                    className={`group relative w-full overflow-hidden rounded-lg sm:rounded-xl py-3 sm:py-3.5 font-bold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                      isValid && !loading
                        ? "bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 text-white shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/75 hover:scale-105 active:scale-95"
                        : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {isValid && !loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}

                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Sending Code...</span>
                        </>
                      ) : (
                        <>
                          <span className="font-black">🚀 Continue</span>
                          <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="relative py-3 sm:py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600/30"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-slate-900/80 px-2 sm:px-3 text-xs text-slate-400 font-medium">OR</span>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="group relative overflow-hidden rounded-lg sm:rounded-xl p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-colors duration-300">
                    <p className="relative text-xs text-blue-300 leading-relaxed font-medium">
                      ✓ Fast & Secure • Your number is safe • SMS rates may apply
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-700/30 space-y-2 sm:space-y-3">
                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold underline transition">
                      Terms
                    </a>
                    {" "}and{" "}
                    <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold underline transition">
                      Privacy
                    </a>
                  </p>
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-base sm:text-lg">🔒</span>
                    <p className="text-xs text-slate-500 font-medium">
                      Enterprise-grade encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-4 sm:mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <span className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="text-xs sm:text-sm text-amber-400">★</span>
                  ))}
                </span>
                <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
