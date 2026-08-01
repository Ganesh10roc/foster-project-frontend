# Fastor - Food Delivery App

A modern, responsive food delivery web application built with React. Order food from multiple restaurants with secure authentication, shopping cart, and real-time order confirmation.

## Features
- 📱 **Responsive Design** - Mobile, Tablet, and Desktop
- 🔐 **Secure Authentication** - Phone + OTP Verification
- 🏪 **Browse Restaurants** - Search & Sort by Rating
- 🛒 **Shopping Cart** - Add items & Checkout
- ✅ **Order Confirmation** - Real-time Status
- 🎨 **Professional UI** - Dark Theme with Orange Accents
- 🛡️ **Security** - Input Sanitization, Rate Limiting, Session Auth

## Tech Stack
- React 18 + React Router v6
- Tailwind CSS (Responsive Design)
- Vite (Dev Server & Build)
- Context API (State Management)
- Native Fetch (API Calls)

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173` and start ordering!

## Project Structure
```
src/
├── pages/           # Route pages (Signup, Home, Cart, etc)
├── components/      # Reusable components
├── context/         # CartContext for state management
├── services/        # API & Image services
└── utils/           # Security helpers & utilities
```

## Build for Production

```bash
npm run build
npm run preview
```

## Author
ganesh10roc (sriramulaganesh375@gmail.com)
# foster-project-frontend
