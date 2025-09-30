/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Dark theme primary colors - Purple/Violet as specified
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Main purple
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Dark theme background colors
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#2C2F3D', // Card background
          900: '#151722', // Main background
        },
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        // Text colors for dark theme
        text: {
          primary: '#ffffff',
          secondary: '#e2e8f0',
          tertiary: '#94a3b8',
          muted: '#64748b',
        },
      },
      fontFamily: {
        'sans': ['System'],
      },
    },
  },
  plugins: [],
}
