/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: "#6C5CE7",
        secondary: "#A29BFE",
        accent: "#FD79A8",
        surface: "#FFFFFF",
        background: "#F5F3FF",
        success: "#00B894",
        warning: "#FDCB6E",
        error: "#D63031",
        info: "#74B9FF",
        dark: {
          primary: "#8B7CF6",
          secondary: "#C4B5FD",
          accent: "#F472B6",
          surface: "#1F2937",
          background: "#111827",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#3B82F6"
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      animation: {
        'card-lift': 'card-lift 0.15s ease-out forwards',
      },
      keyframes: {
        'card-lift': {
          '0%': { transform: 'translateY(0px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
          '100%': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
        }
      }
    },
  },
  plugins: [],
}