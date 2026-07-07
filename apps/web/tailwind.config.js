/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'luxury-950': '#1a0f15',
        'luxury-900': '#2a1f28',
        'luxury-800': '#3d2c35',
        'luxury-gold': '#d4af37',
        'luxury-gold-light': '#e8d4a2',
        'luxury-cream': '#f5f5dc',
        'luxury-cream-dark': '#e8e8d0',
        slate: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
        },
      },
    },
  },
}
