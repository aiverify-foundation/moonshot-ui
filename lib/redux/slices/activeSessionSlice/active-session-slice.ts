import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ActiveSessionState = {
  entity: Session | undefined;
};

const initialState: ActiveSessionState = {
  entity: undefined,
};

export const activeSessionSlice = createSlice({
  name: 'activeSession',
  initialState,
  reducers: {
    setActiveSession: (state, action: PayloadAction<Session>) => {
      state.entity = action.payload;
    },
    removeActiveSession: (state) => {
      state.entity = undefined;
    },
    updateChatHistory: (state, action: PayloadAction<Record<string, DialoguePairInfo[]>>) => {
      if (state.entity) {
        state.entity.chat_history = action.payload;
      }
    },
  },
});

export const { setActiveSession, removeActiveSession, updateChatHistory } =
  activeSessionSlice.actions;
