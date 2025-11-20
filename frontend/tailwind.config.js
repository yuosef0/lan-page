/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#A52A2A',
        'background-light': '#FFFFFF',
        'background-dark': '#1a1a1a',
        'text-light': '#333333',
        'text-dark': '#f0f0f0',
        'border-light': '#e4d3d3',
        'border-dark': '#444444',
      },
      fontFamily: {
        display: ['Public Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
