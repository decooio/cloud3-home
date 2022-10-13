/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'black-1': "#131521",
        gray: {
          6: '#666666',
          7: '#76777C'
        }
      },
      borderWidth: {
        1: "1px",
        3: "3px",
        6: "6px",
      },
    },
  },
  plugins: [],
};
