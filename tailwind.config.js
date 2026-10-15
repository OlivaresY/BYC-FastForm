/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/features/**/*.{js,jsx,ts,tsx}",
    "./src/shared/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // Corporate Color Palette & Tokens
        "primary-dark": "#222222",
        "brand-dark": "#222222",
        "brand-red": "#B91C1C",
        background: "#F7F7F6",
        "brand-bg": "#F7F7F6",
        "brand-beige": "#DEE8E0",
        "brand-green": "#3A5C45",
        "brand-taupe": "#CCC7BD",
        "text-primary": "#111111",
        "text-secondary": "#5A6B80",
        success: "#10B981",
        surface: "#FFFFFF",
        "border-base": "#A39F97",
      },
    },
  },
  plugins: [],
};
