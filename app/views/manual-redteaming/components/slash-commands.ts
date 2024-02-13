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
  DARK_MODE_OFF = 'darkmodeo-ff',
}

export const descriptionByCommand: Record<SlashCommand, string> = {
  [SlashCommand.PROMPT_TEMPLATE]: 'Change the prompt template',
  [SlashCommand.CLEAR_PROMPT_TEMPLATE]: 'Clear the prompt template',
  [SlashCommand.CHAT_LAYOUT_MODE_FREE]: 'Change the chat layout mode to free',
  [SlashCommand.CHAT_LAYOUT_MODE_SLIDE]: 'Change the chat layout mode to slide',
  [SlashCommand.RESET_LAYOUT_MODE]: 'Reset the chat layout mode',
  [SlashCommand.MAXIMIZE_PROMPT]: 'Maximize the prompt',
  [SlashCommand.MINIMIZE_PROMPT]: 'Minimize the prompt',
  [SlashCommand.CLOSE_SESSION]: 'Close the session',
  [SlashCommand.DARK_MODE_ON]: 'Turn on Dark Mode',
  [SlashCommand.DARK_MODE_OFF]: 'Turn off Dark Mode',
};
