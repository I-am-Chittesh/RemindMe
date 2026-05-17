/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#007AFF',
          gray: '#8E8E93',
          lightbg: '#F2F2F7',
          darkbg: '#1C1C1E',
          darkcard: '#2C2C2E',
          darkborder: '#3A3A3C',
          lightcard: '#FFFFFF',
          red: '#FF3B30',
          green: '#34C759',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display',
               'Inter', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'apple': '14px',
        'apple-lg': '20px',
        'apple-xl': '28px',
      },
      boxShadow: {
        'apple': '0 2px 20px rgba(0,0,0,0.08)',
        'apple-dark': '0 2px 20px rgba(0,0,0,0.4)',
        'apple-btn': '0 4px 14px rgba(0,122,255,0.4)',
      },
    },
  },
  plugins: [],
}