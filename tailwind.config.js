/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: {
          50: '#efefed',  // Light gray
          100: '#e2e3e0',
          200: '#afb0ab',  // Light sage
          300: '#7c9482',  // Sage green
          400: '#8e7752',  // Warm brown
          500: '#07393c',  // Deep teal
          600: '#1a1713',  // Dark charcoal
        },
        accent: {
          50: '#f7f3f0',
          100: '#efe7e2',
          200: '#e6d8d0',
          300: '#cbb4a6',  // Warm taupe
          400: '#b29585',
          500: '#8e7752',  // Warm brown
          600: '#725e42',
          700: '#564631',
          800: '#392d21',
          900: '#1d1710',
        },
        // Additional semantic colors
        success: '#7c9482',  // Sage green
        warning: '#8e7752',  // Warm brown
        danger: '#a65d57',   // Muted red
        info: '#07393c',     // Deep teal
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Text',
          'SF Pro Icons',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};