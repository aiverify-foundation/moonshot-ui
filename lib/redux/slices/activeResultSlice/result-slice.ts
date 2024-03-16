import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type ActiveResultState = {
  value: string | undefined;
};

const initialState: ActiveResultState = {
  value: undefined,
};

export const activeResultSlice = createSlice({
  name: 'activeResult',
  initialState,
  reducers: {
    setActiveResult: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    resetActiveResult: (state) => {
      state.value = undefined;
    },
  },
});

export const { setActiveResult, resetActiveResult } = activeResultSlice.actions;
