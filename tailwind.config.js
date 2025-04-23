import { heroui } from '@heroui/theme';
/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
];
export const theme = {
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
    height: {
      screen: '100vh',
      'dvh': '100dvh', 
    }
  },
};
export const darkMode = "class";
export const plugins = [heroui()];
