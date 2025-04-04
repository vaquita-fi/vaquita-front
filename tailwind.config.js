const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        alexandria: ['Alexandria', 'sans-serif'],
      },
      colors: {
        background: '#FEF5E4',
        text: '#191001',
        primary: '#FF9B00',
        success: '#34C759',
        error: '#F3616F',
        secondary: '#FFD699',
        accent: '#FFF0C2',
        muted: '#C4BBAF',
        border: '#EADDC4',
      },
    },
  },
  darkMode: "class",
 plugins: [heroui()],
}
