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
        // Warm cream palette — the foundation of the travel-journal aesthetic
        journal: {
          50:  '#FDFAF4',
          100: '#F7F2EA',
          200: '#EFE5D2',
          300: '#E2D1B8',
          400: '#CFBA98',
          500: '#B09278',
          600: '#8D6F55',
          700: '#6B5040',
          800: '#4A3328',
          900: '#2D1E14',
        },
        // Japan accent colours — slightly muted to sit on the cream background
        japan: {
          red:     '#9B2C2C',
          darkred: '#7A1F1F',
          navy:    '#1C2951',
          gold:    '#B5832A',
          sage:    '#6B8F71',
          sakura:  '#F0B8C8',
        },
      },
    },
  },
  plugins: [],
}

export default config
