import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        corpicia: {
          green: '#2E7D32',
          'green-light': '#EAF4EC',
          'green-dark': '#1B5E20',
          'text-main': '#1F2937',
          'text-soft': '#6B7280',
          'surface': '#F8FAF9',
          'border-soft': '#E5E7EB',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
