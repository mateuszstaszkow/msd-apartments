/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sea: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        brand: {
          DEFAULT: '#1f6cb4',
          dark: '#17538b',
        },
        ink: {
          DEFAULT: '#0b2239',
          soft: '#3f5872',
          muted: '#7c93aa',
        },
        sand: '#f7fafc',
      },
      fontFamily: {
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 24px 80px -24px rgba(14, 165, 233, 0.45)',
        soft: '0 18px 50px -20px rgba(11, 34, 57, 0.25)',
        card: '0 30px 60px -30px rgba(11, 34, 57, 0.35)',
      },
      backgroundImage: {
        'sea-gradient': 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 45%, #bae6fd 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.55))',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        marquee: 'marquee 38s linear infinite',
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-pan': 'gradient-pan 14s ease infinite',
      },
    },
  },
  plugins: [],
};
