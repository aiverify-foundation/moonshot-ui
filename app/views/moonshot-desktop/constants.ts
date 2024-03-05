type ZIndex = {
  Base: number;
  Level_1: number;
  Level_2: number;
  FocusedWindow: number;
  Top: number;
};

export enum WindowIds {
  LLM_ENDPOINTS = 'llmendpExplorer',
  LLM_ENDPOINTS_PICKER = 'llmendpPicker',
  SAVED_SESSIONS = 'savedSessions',
  CREATE_SESSION = 'createSession',
}

// Reserved z-indexes
// Try to follow these zindex layers as much as possible
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
  [WindowIds.LLM_ENDPOINTS_PICKER]: [500, 460],
  [WindowIds.SAVED_SESSIONS]: [1050, 650],
  [WindowIds.CREATE_SESSION]: [820, 470],
};

export const moonshotDesktopDivID = 'moonshotDesktop'; // This is a crucial div element id. There are react portals that port this div
