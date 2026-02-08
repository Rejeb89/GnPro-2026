/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d', // Dark blue (National Guard style)
          light: '#2a4365',
        },
        secondary: {
          DEFAULT: '#c05621', // Deep orange/gold accents
        }
      },
    },
  },
  plugins: [],
}
