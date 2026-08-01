import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "fastor.cart.v1"; // Non-sensitive: localStorage ok
const AUTH_SESSION_KEY = "fastor.auth.v1"; // Sensitive: sessionStorage only

const EMPTY_AUTH = { phone: "", dialCode: "+91", token: null, profile: null };

// Security: Tokens stored in sessionStorage, not localStorage
// sessionStorage clears on browser close (safer than localStorage)
function readAuthFromSession(fallback) {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function readCartFromStorage(fallback) {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  // Cart items: non-sensitive, ok in localStorage
  const [items, setItems] = useState(() => readCartFromStorage([]));

  // Auth token: sensitive, use sessionStorage (clears on browser close)
  const [auth, setAuth] = useState(() => readAuthFromSession(EMPTY_AUTH));

  // Persist cart items to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Persist auth to sessionStorage (NOT localStorage)
  useEffect(() => {
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(auth));
  }, [auth]);

  const addToCart = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (p) => p.id === item.id && p.portion === item.portion
      );
      if (existing) {
        return prev.map((p) =>
          p === existing ? { ...p, qty: p.qty + item.qty } : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (indexOrId, portion) => {
    setItems((prev) => {
      // Support both index-based removal and id-based removal
      if (typeof indexOrId === 'number' && portion === undefined) {
        // Remove by index
        return prev.filter((_, idx) => idx !== indexOrId);
      } else {
        // Remove by id and portion
        return prev.filter((p) => !(p.id === indexOrId && p.portion === portion));
      }
    });
  };

  // Called after a successful register/OTP-send call.
  const setPendingPhone = (phone, dialCode = "+91") => {
    setAuth((prev) => ({ ...prev, phone, dialCode }));
  };

  // Called after a successful login-with-OTP call.
  const setToken = (token, profile = null) => {
    setAuth((prev) => ({ ...prev, token, profile }));
  };

  const logout = () => {
    setAuth(EMPTY_AUTH);
    setItems([]);
  };

  /**
   * Clears the JWT but keeps the phone number, so an expired session drops the
   * user back to /signup with their number ready rather than a blank slate.
   */
  const expireSession = () => {
    setAuth((prev) => ({ ...prev, token: null, profile: null }));
  };

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    cartCount,
    cartTotal,
    phone: auth.phone,
    dialCode: auth.dialCode,
    token: auth.token,
    profile: auth.profile,
    userName: auth.profile?.name || "",
    isAuthenticated: Boolean(auth.token),
    setPendingPhone,
    setToken,
    logout,
    expireSession,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
