/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-blue': '#2C3E50',
        'light-gray': '#ECF0F1',
        'teal': '#1ABC9C',
        'blue': '#3498DB',
        'yellow': '#F1C40F',
        'medium-gray': '#7F8C8D',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}