import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type SessionsState = {
  entities: Session[];
};

const initialState: SessionsState = {
  entities: [],
};

export const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    all: (state, action: PayloadAction<Session[]>) => {
      state.entities = action.payload;
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.entities.unshift(action.payload);
    },
    removeSession: (state, action: PayloadAction<Session>) => {
      state.entities = state.entities.filter(
        (session) => session.session_id !== action.payload.session_id
      );
    },
  },
});

export const { addSession, removeSession, all } = sessionsSlice.actions;
