/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          950: '#08111f',
          900: '#0c1628',
          800: '#12213a'
        },
        panel: {
          900: '#0f1b31',
          800: '#142341',
          700: '#1c3058'
        },
        primary: {
          50: '#eef7ff',
          100: '#d9ebff',
          200: '#b9dbff',
          300: '#8ac5ff',
          400: '#54a9ff',
          500: '#2c8bff',
          600: '#156ef0',
          700: '#0f56c2',
          800: '#114891',
          900: '#0f3d74'
        },
      },
      boxShadow: {
        soft: '0 20px 60px rgba(0,0,0,0.25)'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(44,139,255,.24), transparent 45%)'
      }
    },
  },
  plugins: [],
};
