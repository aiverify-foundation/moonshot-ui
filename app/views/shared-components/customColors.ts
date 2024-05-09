import tailwindConfig from '@/tailwind.config';

type CustomColors = {
  moongray: Record<string, string>;
  moonwine: Record<string, string>;
  imdalight: Record<string, string>;
  white: string;
  black: string;
  moonpurplelight: string;
  moonpurple: string;
};

export const colors = tailwindConfig.theme?.extend?.colors as CustomColors;
