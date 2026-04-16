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
    },
  },
  plugins: [],
}
export default config
