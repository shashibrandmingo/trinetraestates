import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Real Estate Palette matching Brand Logo
        gold: {
          50: '#fbf8f0',
          100: '#f5edd7',
          200: '#eddab0',
          300: '#e1c382',
          400: '#d5ab56',
          500: '#c5a363', // Brand Gold
          600: '#b08d4b',
          700: '#927138',
          800: '#755830',
          900: '#5f4728'
        },
        navy: {
          50: '#f0f4f9',
          100: '#e2ebf4',
          200: '#c5d8ea',
          300: '#9bbfdb',
          400: '#6aa0c7',
          500: '#4683b2',
          600: '#326998',
          700: '#26537b',
          800: '#162d4d',
          900: '#0c1a30', // Brand Midnight Navy Blue
          950: '#07101e'
        }
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        sans: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
