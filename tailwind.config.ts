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
        'cookitie': ['Fredoka', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cookitie': {
          'blue': {
            50: '#f0f8ff',
            100: '#e0f0ff',
            200: '#b8e0ff',
            300: '#7cc8ff',
            400: '#36a9ff',
            500: '#0084ff',
            600: '#0066cc',
            700: '#004d99',
          },
          'yellow': {
            50: '#fffef0',
            100: '#fffae0',
            200: '#fff5b8',
            300: '#ffec7c',
            400: '#ffe036',
            500: '#ffd700',
            600: '#e6c200',
            700: '#cc9900',
          },
          'pink': {
            50: '#fef7f7',
            100: '#fdeaea',
            200: '#fbd4d4',
            300: '#f8b4b4',
            400: '#f48888',
            500: '#ef4444',
          },
          'green': {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
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