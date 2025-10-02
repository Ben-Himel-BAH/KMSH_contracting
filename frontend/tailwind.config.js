/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",   // 👈 scan all your React/TSX files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
