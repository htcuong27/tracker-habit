/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        secondary: "#06b6d4",
        accent: "#8b5cf6",
        background: "#000000",
      },
    },
  },
  plugins: [],
}
