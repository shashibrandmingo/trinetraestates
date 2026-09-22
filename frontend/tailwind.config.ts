import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
      scale: {
        '102': '1.02',
        '105': '1.05',
        '106': '1.06',
        '108': '1.08',
        '115': '1.15',
        '120': '1.20',
        '125': '1.25',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '2xs': '0 1px 1px 0 rgba(0, 0, 0, 0.03)',
      },
      backdropBlur: {
        'xs': '2px',
      },
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
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['var(--font-sans)', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
