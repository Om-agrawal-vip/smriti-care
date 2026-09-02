/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A7C7C',
          light: '#7FA8A8',
        },
        secondary: {
          DEFAULT: '#8FA876',
        },
        background: '#FAF7F2',
        surface: '#FFFFFF',
        'text-primary': '#2D3436',
        'text-secondary': '#6B7280',
        warning: '#E8A87C',
        alert: '#E8A87C',
        success: '#7FB069',
      },
      fontFamily: {
        sans: ['Nunito', 'Quicksand', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'teal-glow': '0 12px 32px -4px rgba(74, 124, 124, 0.25)',
        'teal-card': '0 16px 40px -8px rgba(74, 124, 124, 0.18)',
        'sage-glow': '0 12px 32px -4px rgba(143, 168, 118, 0.3)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      minHeight: {
        'button': '56px',
      },
    },
  },
  plugins: [],
}
