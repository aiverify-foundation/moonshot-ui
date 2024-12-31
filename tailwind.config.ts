import { colors } from './colors/colors';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        chatboxbg: '#2D2B2F',
        chatBubbleWhite: '#DDDDDD',
        chatPrompTextArea: '#353236',
        imdapurple: '#49305A',
        moonpurplelight: '#d5aaea',
        moonpurple: '#392348',
        reportText: '#bcb9c0',
        ...colors,
      },
      screens: {
        ipad11Inch: { max: '1194px' },
        ipadPro: { max: '1370px' },
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
