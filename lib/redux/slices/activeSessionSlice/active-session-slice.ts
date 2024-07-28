import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ActiveSessionState = {
  entity: SessionData | undefined;
};

const initialState: ActiveSessionState = {
  entity: undefined,
};

export const activeSessionSlice = createSlice({
  name: 'activeSession',
  initialState,
  reducers: {
    setActiveSession: (state, action: PayloadAction<SessionData>) => {
      state.entity = action.payload;
    },
    removeActiveSession: (state) => {
      state.entity = undefined;
    },
    updateChatHistory: (
      state,
      action: PayloadAction<Record<string, PromptDetails[]>>
    ) => {
      if (state.entity) {
        state.entity.chat_records = action.payload;
      }
    },
    appendChatHistory: (
      state,
      action: PayloadAction<Record<string, PromptDetails[]>>
    ) => {
      if (state.entity) {
        Object.keys(action.payload).forEach((endpointId) => {
          if (state.entity && state.entity.chat_records) {
            state.entity.chat_records[endpointId] = (
              state.entity.chat_records[endpointId] || []
            ).concat(action.payload[endpointId]);
          }
        });
      }
    },
  },
});

export const {
  setActiveSession,
  removeActiveSession,
  updateChatHistory,
  appendChatHistory,
} = activeSessionSlice.actions;
