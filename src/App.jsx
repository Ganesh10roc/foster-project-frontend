import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.jsx";
import OtpVerify from "./pages/OtpVerify.jsx";
import Home from "./pages/Home.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import Cart from "./pages/Cart.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";

export default function App() {
  return (
    <div className="app-stage">
      <div className="phone-shell">
        <div className="phone-notch" />
        <div className="phone-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify" element={<OtpVerify />} />
            <Route path="/home" element={<Home />} />
            <Route path="/item/:id" element={<RestaurantDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
