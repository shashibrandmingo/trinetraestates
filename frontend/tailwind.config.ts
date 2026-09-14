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
        white: '#ffffff',
        // Eye-Comforting Blue Palette (replaces harsh mustard gold with soothing royal blue)
        gold: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc4fa',
          400: '#38a5f8',
          500: '#2563eb', // Comfort Blue Primary
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554'
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
