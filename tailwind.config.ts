import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'system-ui', 'sans-serif'],
        'cookitie': ['Poppins', 'sans-serif'],
        'modern': ['Poppins', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
      },
      colors: {
        'cookitie': {
          'blue': {
            50: '#f8fbff',
            100: '#eef4ff',
            200: '#d6e7ff',
            300: '#a8cfff',
            400: '#7bb3ff',
            500: '#4d94ff',
            600: '#2d7ae6',
            700: '#1e5bb8',
            800: '#16408a',
          },
          'yellow': {
            50: '#fffef8',
            100: '#fffcee',
            200: '#fff7d6',
            300: '#ffefa8',
            400: '#ffe67b',
            500: '#ffdd4d',
            600: '#e6c72d',
            700: '#b89e1e',
            800: '#8a7516',
          },
          'pink': {
            50: '#fef8f8',
            100: '#fdeeee',
            200: '#fbd6d6',
            300: '#f8a8a8',
            400: '#f47b7b',
            500: '#f04d4d',
          },
          'green': {
            50: '#f8fef8',
            100: '#eefdee',
            200: '#d6fbd6',
            300: '#a8f8a8',
            400: '#7bf47b',
            500: '#4df04d',
          },
          'purple': {
            50: '#f8f6ff',
            100: '#eeeaff',
            200: '#d6d0ff',
            300: '#a899ff',
            400: '#7b62ff',
            500: '#4d2bff',
          }
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float 8s ease-in-out infinite reverse',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-in-left': 'slideInLeft 0.8s ease-out',
        'slide-in-right': 'slideInRight 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-cookitie-blue': 'linear-gradient(135deg, var(--cookitie-blue-100) 0%, var(--cookitie-blue-200) 100%)',
        'gradient-cookitie-yellow': 'linear-gradient(135deg, var(--cookitie-yellow-100) 0%, var(--cookitie-yellow-200) 100%)',
        'gradient-cookitie-mixed': 'linear-gradient(45deg, var(--cookitie-blue-100) 0%, var(--cookitie-yellow-100) 50%, var(--cookitie-pink-100) 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config