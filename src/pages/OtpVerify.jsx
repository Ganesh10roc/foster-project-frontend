import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { loginWithOtp, registerUser } from "../services/api.js";
import rateLimiter, { RATE_LIMITS } from "../utils/rateLimiter.js";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;
const MAX_ATTEMPTS = 5;

export default function OtpVerify() {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();
  const { phone, dialCode, setToken } = useCart();

  const lockedOut = attempts >= MAX_ATTEMPTS;

  useEffect(() => {
    if (!phone) {
      navigate("/signup", { replace: true });
    }
  }, [phone, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const submitOtp = async (otp) => {
    if (loading || lockedOut) return;

    // Security: Rate limiting to prevent brute force OTP attacks
    const rateLimitKey = `otp_${phone}`;
    const rateCheck = rateLimiter.checkLimit(
      rateLimitKey,
      RATE_LIMITS.OTP_VERIFICATION.maxAttempts,
      RATE_LIMITS.OTP_VERIFICATION.windowMs
    );

    if (!rateCheck.allowed) {
      setError(`Rate limited: ${rateCheck.message}`);
      setCode("");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    try {
      const { token, profile } = await loginWithOtp({ phone, otp, dialCode });
      setToken(token, profile);
      rateLimiter.reset(rateLimitKey); // Clear rate limit on success
      navigate("/home");
    } catch (err) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setCode("");
      if (nextAttempts >= MAX_ATTEMPTS) {
        setError("Too many attempts. Please request a new code.");
        setSeconds(RESEND_SECONDS);
      } else {
        const left = MAX_ATTEMPTS - nextAttempts;
        setError(`${err.message || "Invalid verification code."} ${left} attempt${left !== 1 ? "s" : ""} remaining.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= CODE_LENGTH) {
      setCode(val);
      setError("");
      if (val.length === CODE_LENGTH) {
        setTimeout(() => submitOtp(val), 100);
      }
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending || !phone) return;
    setResending(true);
    setError("");
    setNotice("");
    try {
      await registerUser({ phone, dialCode });
      setCode("");
      setAttempts(0);
      setSeconds(RESEND_SECONDS);
      setNotice(`✓ Verification code sent to ${dialCode} ${phone}`);
    } catch (err) {
      setError(err.message || "Could not send code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{contain: 'layout style paint'}}>
        <div className="absolute -top-32 -right-32 sm:-top-40 sm:-right-40 lg:-top-48 lg:-right-48 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-orange-500/10 rounded-full blur-2xl will-change-transform"></div>
        <div className="absolute -bottom-32 -left-32 sm:-bottom-40 sm:-left-40 lg:-bottom-48 lg:-left-48 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-blue-500/10 rounded-full blur-2xl will-change-transform"></div>
      </div>

      {/* Content - Landscape Optimized */}
      <div className="relative z-10 w-full max-w-7xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/signup")}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold mb-6 transition-colors group cursor-pointer text-sm"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span>Back to Sign Up</span>
        </button>

        {/* Two Column Layout - Landscape Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* LEFT: Info Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl">✅</span>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Verify Account</h1>
                <p className="text-orange-400 font-semibold text-lg">Secure & Fast</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4 pt-4">
              {[
                { icon: "⚡", title: "Instant Verification", desc: "Takes less than a minute" },
                { icon: "🔒", title: "Fully Secure", desc: "Enterprise-grade encryption" },
                { icon: "✓", title: "One-Time Code", desc: "Valid for 10 minutes only" },
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4 group cursor-pointer">
                  <div className="text-2xl transform group-hover:scale-125 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{benefit.title}</h3>
                    <p className="text-slate-400 text-xs">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Phone Display */}
            <div className="pt-6 border-t border-slate-700/50">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Code sent to</p>
              <div className="flex items-center gap-2 text-lg font-bold text-orange-400">
                <span>📱</span>
                <span>{dialCode} {phone}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Form Section */}
          <div className="w-full">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

              {/* Card Content */}
              <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border border-slate-700/50 shadow-2xl">

                {/* Mobile Header (visible only on small screens) */}
                <div className="lg:hidden mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">✅</div>
                    <h1 className="text-2xl font-black text-white">Verify Account</h1>
                  </div>
                  <p className="text-slate-400 text-sm">
                    Code sent to <span className="text-orange-400 font-bold">{dialCode} {phone}</span>
                  </p>
                </div>

                {/* Form Section */}
                <div className="space-y-5">

                  {/* Label */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                      🔐 Verification Code
                    </label>
                  </div>

                  {/* OTP Input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={code}
                      onChange={handleCodeChange}
                      placeholder="000000"
                      maxLength={CODE_LENGTH}
                      className="w-full bg-slate-700/30 border-2 border-slate-600/60 rounded-xl px-4 py-4 text-center text-3xl sm:text-4xl font-bold tracking-widest text-white placeholder-slate-600 focus:outline-none focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30 transition-all duration-300 backdrop-blur-sm font-mono"
                    />

                    {/* Progress bars */}
                    <div className="flex gap-1.5 mt-3">
                      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all duration-200 ease-out ${
                            i < code.length
                              ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/50 scale-y-110"
                              : "bg-slate-600/30"
                          }`}
                        ></div>
                      ))}
                    </div>

                    <p className="mt-2 text-xs text-slate-400 text-center font-medium">
                      {code.length}/{CODE_LENGTH} digits
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="group animate-shake">
                      <div className="relative bg-red-500/10 border-l-4 border-red-500 rounded-lg px-4 py-3 backdrop-blur-sm">
                        <div className="flex gap-3">
                          <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
                          <p className="text-red-300 text-xs sm:text-sm font-medium">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {notice && (
                    <div className="group animate-fadeIn">
                      <div className="relative bg-green-500/10 border-l-4 border-green-500 rounded-lg px-4 py-3 backdrop-blur-sm">
                        <div className="flex gap-3">
                          <span className="text-green-400 text-lg flex-shrink-0">✓</span>
                          <p className="text-green-300 text-xs sm:text-sm font-medium">{notice}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => code.length === CODE_LENGTH && submitOtp(code)}
                    disabled={code.length !== CODE_LENGTH || loading || lockedOut}
                    className={`group relative w-full overflow-hidden rounded-xl py-3 sm:py-3.5 font-bold text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                      code.length === CODE_LENGTH && !loading && !lockedOut
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/75 hover:scale-105 active:scale-95"
                        : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {code.length === CODE_LENGTH && !loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}

                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <span className="inline-block w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>✓ Verify & Continue</span>
                          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Resend Section */}
                  <div className="bg-slate-700/30 border border-slate-600/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs sm:text-sm text-slate-400 font-medium">
                        {seconds > 0 ? (
                          <>Resend in <span className="text-orange-400 font-bold">{seconds}s</span></>
                        ) : (
                          "Ready to resend"
                        )}
                      </span>
                      <button
                        onClick={handleResend}
                        disabled={seconds > 0 || resending || lockedOut}
                        className={`font-semibold text-xs sm:text-sm transition-all ${
                          seconds > 0 || resending || lockedOut
                            ? "text-slate-500 cursor-not-allowed"
                            : "text-orange-400 hover:text-orange-300 cursor-pointer"
                        }`}
                      >
                        {resending ? "Sending..." : "Resend"}
                      </button>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 backdrop-blur-sm">
                    <p className="text-xs text-blue-300 leading-relaxed font-medium">
                      🔒 Your code is valid for 10 minutes. Never share it with anyone.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-slate-700/30 space-y-2">
                  <p className="text-xs text-slate-500 text-center leading-relaxed">
                    By continuing, you agree to our{" "}
                    <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold underline">
                      Terms
                    </a>
                    {" "}and{" "}
                    <a href="#" className="text-orange-400 hover:text-orange-300 font-semibold underline">
                      Privacy
                    </a>
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <span>🛡️</span>
                    <p className="text-xs text-slate-500 font-medium">Enterprise-grade security</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-2">
                <span className="flex gap-1">
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
