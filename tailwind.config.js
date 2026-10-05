/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le indica a Tailwind en qué carpetas debe buscar las clases para compilarlas
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
    "./src/shared/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#F7F7F6',
        'brand-dark': '#222222',
        'brand-red': '#B91C1C',
        'brand-beige': '#DEE8E0',
        'brand-green': '#3A5C45',
        'brand-taupe': '#CCC7BD'
      }
    },
  },
  plugins: [],
}