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
        japan: {
          red: '#BC002D',
          darkred: '#8B0020',
          cream: '#FFF9F0',
          sakura: '#FFB7C5',
          navy: '#1C2951',
          gold: '#C9A84C',
        },
      },
    },
  },
  plugins: [],
}

export default config
