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
          7: '#76777C',
          8: '#898F8F',
          16: '#e0e0e7'
        },
        orange: {
          15: '#FC7823',
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
