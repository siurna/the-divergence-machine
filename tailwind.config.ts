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
          DEFAULT: '#00F0FF',
          dark: '#00B8C4',
          light: '#7DF9FF',
        },
        secondary: '#FF00E5',
        accent: '#FFE500',
        success: '#39FF14',
        warning: '#FF6B00',
        danger: '#FF0055',
        'bg-dark': '#0A0A0F',
        'bg-card': '#12121A',
        'bg-elevated': '#1A1A25',
        'text-primary': '#FFFFFF',
        'text-muted': '#8888AA',
        neon: {
          blue: '#00F0FF',
          pink: '#FF00E5',
          green: '#39FF14',
          yellow: '#FFE500',
          orange: '#FF6B00',
          purple: '#BF00FF',
          red: '#FF0055',
        },
        category: {
          politics: '#FF0055',
          tech: '#00F0FF',
          entertainment: '#FF00E5',
          science: '#39FF14',
          sports: '#FF6B00',
          lifestyle: '#BF00FF',
          finance: '#FFE500',
          animals: '#FF8800',
        },
      },
      fontFamily: {
        code: ['watch-mn', 'sans-serif'],
        title: ['hansson-stencil-mn', 'sans-serif'],
        body: ['kallisto', 'sans-serif'],
        sans: ['kallisto', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-blue': '0 0 5px #00F0FF, 0 0 20px #00F0FF, 0 0 40px #00F0FF',
        'neon-pink': '0 0 5px #FF00E5, 0 0 20px #FF00E5, 0 0 40px #FF00E5',
        'neon-green': '0 0 5px #39FF14, 0 0 20px #39FF14, 0 0 40px #39FF14',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
