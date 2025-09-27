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
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        'sans': ['Nunito', 'system-ui', 'sans-serif'],
        'cookitie': ['Poppins', 'sans-serif'],
        'modern': ['Poppins', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        'cookittie': {
          'white': '#ffffff',
          'black': '#000000',
          'beige': '#fdf8e5',
          'yellow': '#fdf1c3',
          'blue': '#d1eaed',
          'gray': '#f5f5f5',
        },
        'pink': {
          200: '#fecaca',
          300: '#fca5a5',
          500: '#ec4899',
        },
        'blue': {
          200: '#bfdbfe',
          600: '#2563eb',
        },
        'yellow': {
          200: '#fef08a',
          400: '#facc15',
        },
        'gray': {
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          600: '#4b5563',
          700: '#374151',
        },
        'primary': {
          50: '#fef7e0',
          100: '#fdf1c3',
          200: '#f9e8a3',
          300: '#f5df83',
          400: '#f1d663',
          500: '#edcd43',
          600: '#d4b53c',
          700: '#bb9d35',
          800: '#a2852e',
          900: '#896d27',
        },
        'secondary': {
          50: '#e8f4f6',
          100: '#d1eaed',
          200: '#b8dde1',
          300: '#9fd0d5',
          400: '#86c3c9',
          500: '#6db6bd',
          600: '#62a4aa',
          700: '#579297',
          800: '#4c8084',
          900: '#416e71',
        },
        'accent': {
          50: '#fdf8e5',
          100: '#fdf8e5',
          200: '#fdf8e5',
          300: '#fdf8e5',
          400: '#fdf8e5',
          500: '#fdf8e5',
          600: '#fdf8e5',
          700: '#fdf8e5',
          800: '#fdf8e5',
          900: '#fdf8e5',
        },
        'neutral': {
          50: '#f5f5f5',
          100: '#f5f5f5',
          200: '#f5f5f5',
          300: '#f5f5f5',
          400: '#f5f5f5',
          500: '#f5f5f5',
          600: '#f5f5f5',
          700: '#f5f5f5',
          800: '#f5f5f5',
          900: '#f5f5f5',
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
        'gradient-cookittie': 'linear-gradient(135deg, #fdf8e5 0%, #fdf1c3 100%)',
        'gradient-cookittie-subtle': 'linear-gradient(135deg, #fdf8e5 0%, #d1eaed 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config