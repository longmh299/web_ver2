// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // cho phép bật dark mode theo class
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      // gutter hiện đại: 16px mobile, 24px desktop
      padding: { DEFAULT: "16px", lg: "24px" },
      // mở rộng khung nội dung tới 1600px cho màn lớn
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1600px", // <- rộng hơn để hết cảm giác "khuôn bé"
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2653ED",
          foreground: "#ffffff",
        },
        accent: "#F5ED42",
        surface: "#F8FAFC", // nền nhẹ cho full-bleed section
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)",
        "card-hover":
          "0 6px 16px rgba(16,24,40,.10), 0 2px 6px rgba(16,24,40,.06)",
      },
      fontFamily: {
        // nếu dùng next/font Inter: className="font-sans"
        sans: ["Inter", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
      transitionTimingFunction: {
        "soft-out": "cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
