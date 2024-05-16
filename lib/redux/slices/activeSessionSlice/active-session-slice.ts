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
      action: PayloadAction<Record<string, DialoguePairInfo[]>>
    ) => {
      if (state.entity) {
        state.entity.chat_records = action.payload;
      }
    },
  },
});

export const { setActiveSession, removeActiveSession, updateChatHistory } =
  activeSessionSlice.actions;
