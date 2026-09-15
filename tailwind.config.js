/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./blog/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        brand: {
          navy: "#051b2c",
          gold: "#c5a059",
          cream: "#f8f5f0",
          blue: "#123a52",
        },
      },
      animation: {
        "slow-pan": "slowPan 20s ease-in-out infinite alternate",
        "fade-in-up": "fadeInUp 1s ease-out forwards",
      },
      keyframes: {
        slowPan: {
          "0%": { transform: "scale(1.1) translateX(0)" },
          "100%": { transform: "scale(1.18) translateX(-2%)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
