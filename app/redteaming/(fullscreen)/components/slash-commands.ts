export enum SlashCommand {
  PROMPT_TEMPLATE = 'template',
  CLEAR_PROMPT_TEMPLATE = 'clear-template',
  CHAT_LAYOUT_MODE_FREE = 'free-layout',
  CHAT_LAYOUT_MODE_SLIDE = 'slide-layout',
  RESET_LAYOUT_MODE = 'reset-layout',
  MAXIMIZE_PROMPT = 'maxinput',
  MINIMIZE_PROMPT = 'mininput',
  CLOSE_SESSION = 'exit',
  DARK_MODE_ON = 'darkmode-on',
  DARK_MODE_OFF = 'darkmode-off',
}

export const descriptionByCommand: Record<SlashCommand, string> = {
  [SlashCommand.PROMPT_TEMPLATE]: 'Update prompt template',
  [SlashCommand.CLEAR_PROMPT_TEMPLATE]: 'Clear prompt template',
  [SlashCommand.CHAT_LAYOUT_MODE_FREE]: 'Change chat layout to Free mode',
  [SlashCommand.CHAT_LAYOUT_MODE_SLIDE]: 'Change chat layout to Slide mode',
  [SlashCommand.RESET_LAYOUT_MODE]: 'Reset chat positions',
  [SlashCommand.MAXIMIZE_PROMPT]: 'Maximize prompt input',
  [SlashCommand.MINIMIZE_PROMPT]: 'Minimize prompt input',
  [SlashCommand.CLOSE_SESSION]: 'Close session',
  [SlashCommand.DARK_MODE_ON]: 'Turn on Dark Mode',
  [SlashCommand.DARK_MODE_OFF]: 'Turn off Dark Mode',
};
