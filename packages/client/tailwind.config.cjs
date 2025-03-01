/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Factory-themed colors
        'factory-dark': '#1a2b3c',
        'factory-light': '#e9eef2',
        'warning': '#f59e0b',
        'critical': '#ef4444',
        'normal': '#10b981',
      },
    },
  },
  plugins: [],
}