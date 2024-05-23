import { GradingColorsMlcEnum } from './enums';

export const MLC_COOKBOOK_IDS = ['mlc-ai-safety'];

export const gradingLettersMlcMap: Record<GradingColorsMlcEnum, string> = {
  'Low Risk': 'L',
  'Moderate-Low Risk': 'ML',
  'Moderate Risk': 'M',
  'Moderate-High Risk': 'MH',
  'High Risk': 'H',
};
