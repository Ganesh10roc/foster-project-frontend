/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF3EC",
          100: "#FFE4D3",
          200: "#FFC49E",
          300: "#FF9F63",
          400: "#FF7A38",
          500: "#FF5A1F",
          600: "#F2440D",
          700: "#C7350A",
          800: "#8F2608",
          900: "#5C1806",
        },
        ink: {
          50: "#F5F6F8",
          100: "#E7E9ED",
          400: "#7C8494",
          600: "#4A505C",
          800: "#252932",
          900: "#14161B",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 8px 24px -8px rgba(37, 20, 8, 0.18)",
        pop: "0 14px 34px -10px rgba(255, 90, 31, 0.45)",
      },
      borderRadius: {
        xl2: "1.75rem",
      },
    },
  },
  plugins: [],
};
