type ZIndex = {
  Base: number;
  Level_1: number;
  Level_2: number;
  FocusedWindow: number;
  Top: number;
};

export const WindowIds = {
  LLM_ENDPOINTS: 'llmendpExplorer',
  SAVED_SESSIONS: 'savedSessions',
  CREATE_SESSION: 'createSession',
};

export const Z_Index: ZIndex = {
  Base: 1,
  Level_1: 100,
  Level_2: 200,
  FocusedWindow: 998,
  Top: 999,
};

export const defaultWindowWidthHeight: {
  [x: string]: [number, number];
} = {
  [WindowIds.LLM_ENDPOINTS]: [1050, 650],
  [WindowIds.SAVED_SESSIONS]: [820, 470],
  [WindowIds.CREATE_SESSION]: [820, 470],
};
