export enum SlashCommand {
  PROMPT_TEMPLATE = 'template',
  CLEAR_PROMPT_TEMPLATE = 'cleartemplate',
  CHAT_LAYOUT_MODE_FREE = 'freelayout',
  CHAT_LAYOUT_MODE_SLIDE = 'slidelayout',
  RESET_LAYOUT_MODE = 'resetlayout',
  MAXIMIZE_PROMPT = 'maxinput',
  MINIMIZE_PROMPT = 'mininput',
  CLOSE_SESSION = 'exit',
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
};
