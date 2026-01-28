import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#818CF8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        'bg-dark': '#0F172A',
        'bg-card': '#1E293B',
        'text-primary': '#F8FAFC',
        'text-muted': '#94A3B8',
        category: {
          politics: '#EF4444',
          tech: '#6366F1',
          entertainment: '#EC4899',
          science: '#22C55E',
          sports: '#F59E0B',
          lifestyle: '#14B8A6',
          finance: '#8B5CF6',
          animals: '#F97316',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
