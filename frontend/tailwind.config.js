/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f5ff',
          100: '#ece9ff',
          200: '#d6d0ff',
          300: '#b3a4ff',
          400: '#8b78ff',
          500: '#6a4dff',
          600: '#553be0',
          700: '#4130b2',
          800: '#302685',
          900: '#241f62'
        }
      }
    }
  },
  plugins: []
};
