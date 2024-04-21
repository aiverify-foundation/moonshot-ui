import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'moonwide-gradient': `linear-gradient(to right, #363138 10%, #594a60 90%)`,
      },
      colors: {
        e7e7e7: '#e7e7e7',
        fuchsia: {
          980: '#702f8a',
          1000: '#4c2b5d',
        },
        logocolor: '#d5aaea',
        // moonwine: {
        //   50: '#f7f7f8',
        //   100: '#f0eef0',
        //   200: '#ddd9de',
        //   300: '#bfb7c2',
        //   400: '#9b90a0',
        //   500: '#7f7285',
        //   600: '#685c6d',
        //   700: '#554b59',
        //   800: '#47414b',
        //   900: '#363138',
        //   950: '#2a262b',
        // },
        moonwine: {
          50: '#f9f8fb',
          100: '#f4f1f6',
          200: '#e8e3eb',
          300: '#d5ccdb',
          400: '#bcadc5',
          500: '#9f8baa',
          600: '#826d8c',
          700: '#6a5873',
          800: '#594a60',
          900: '#4b3f50',
          950: '#2c2230',
        },
        moongray: {
          50: '#f7f7f8',
          100: '#efeef0',
          200: '#dbdadd',
          300: '#bcb9c0',
          400: '#97939d',
          500: '#7a7582',
          600: '#645f6a',
          700: '#524e56',
          800: '#464349',
          900: '#3d3a40',
          950: '#2d2b2f',
        },
        imdalight: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
          980: '#702f8a',
          1000: '#4c2b5d',
        },
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      backgroundColor: ['hover'],
    },
  },
  darkMode: 'class',
};
export default config;
