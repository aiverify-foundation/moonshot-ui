export enum WindowIds {
  LLM_ENDPOINTS = 'llmendpExplorer',
  LLM_ENDPOINTS_PICKER = 'llmendpPicker',
  SAVED_SESSIONS = 'savedSessions',
  SESSION_FORM = 'sessionForm',
  RED_TEAMING_SESSION = 'redTeamingSession',
  BENCHMARKING = 'benchmarking',
  COOKBOOKS = 'cookbooks',
  COOKBOOKS_PICKER = 'cookbooksPicker',
  RECIPES = 'recipes',
  RECIPES_PICKER = 'recipesPicker',
  PROMPT_TEMPLATES = 'promptTemplates',
  STATUS = 'status',
  RESULT = 'result',
}

// Reserved z-indexes
// Try to follow these zindex layers as much as possible
// The values are currently typechecked to these fixed values. The type is in global.dts
export const Z_Index: ZIndex = {
  Base: 1, // first layer - for any elements that need to sit between the desktop background and icons (background logo image, etc)
  Level_1: 100, // second layer - specifically the desktop icons layer
  Level_2: 200, // third layer - all windows should be on this layer
  FocusedWindow: 998, // fourth layer - any focused window, should be set to this layer
  Top: 999, // fifth layer - for any elements that needs to be at the top most layer (modal popup, tooltip, etc)
};

export const defaultWindowWidthHeight: {
  [x: string]: [number, number];
} = {
  [WindowIds.LLM_ENDPOINTS]: [1050, 825],
  [WindowIds.COOKBOOKS]: [1050, 650],
  [WindowIds.PROMPT_TEMPLATES]: [1050, 650],
  [WindowIds.RECIPES]: [1050, 660],
  [WindowIds.SAVED_SESSIONS]: [1550, 800],
  [WindowIds.SESSION_FORM]: [1550, 800],
  [WindowIds.BENCHMARKING]: [1550, 800],
  [WindowIds.RECIPES_PICKER]: [500, 460],
  [WindowIds.LLM_ENDPOINTS_PICKER]: [600, 400],
  [WindowIds.COOKBOOKS_PICKER]: [600, 400],
  [WindowIds.STATUS]: [280, 380],
  [WindowIds.RESULT]: [1550, 800],
};

export const moonshotDesktopDivID = 'moonshotDesktop'; // This is a crucial div element id. There are react portals that port elements to this div
