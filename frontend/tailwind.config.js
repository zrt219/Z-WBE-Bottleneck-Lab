/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#f8fafc',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          'border-subtle': '#f1f5f9',
          dark: '#0f172a',
          text: '#0f172a',
          muted: '#64748b',
          accent: '#2563eb', // refined cobalt
          'accent-hover': '#1d4ed8',
          danger: '#dc2626',
          warning: '#d97706',
          success: '#059669',
          info: '#0284c7'
        }
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 6px 16px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'glow-blue': '0 0 15px -3px rgba(37, 99, 235, 0.25)',
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.25)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}

