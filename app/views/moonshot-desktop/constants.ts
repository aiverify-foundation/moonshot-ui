export enum WindowIds {
  LLM_ENDPOINTS = 'llmendpExplorer',
  LLM_ENDPOINTS_PICKER = 'llmendpPicker',
  SAVED_SESSIONS = 'savedSessions',
  CREATE_SESSION = 'createSession',
  RED_TEAMING_SESSION = 'redTeamingSession',
  BENCHMARKING = 'benchmarking',
  COOKBOOKS = 'cookbooks',
  COOKBOOKS_PICKER = 'cookbooksPicker',
  RECIPES = 'recipes',
  RECIPES_PICKER = 'recipesPicker',
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
  [WindowIds.LLM_ENDPOINTS]: [1050, 650],
  [WindowIds.COOKBOOKS]: [1050, 650],
  [WindowIds.RECIPES]: [1050, 750],
  [WindowIds.LLM_ENDPOINTS_PICKER]: [500, 460],
  [WindowIds.RECIPES_PICKER]: [500, 460],
  [WindowIds.COOKBOOKS_PICKER]: [500, 460],
  [WindowIds.SAVED_SESSIONS]: [1250, 700],
  [WindowIds.CREATE_SESSION]: [820, 470],
  [WindowIds.BENCHMARKING]: [1150, 650],
};

export const moonshotDesktopDivID = 'moonshotDesktop'; // This is a crucial div element id. There are react portals that port elements to this div
