import { PayloadAction, createSlice } from '@reduxjs/toolkit';

enum LayoutMode {
  FREE = 'FREE',
  SLIDE = 'SLIDE',
}

type ChatLayoutModeState = {
  value: LayoutMode;
};

const initialState: ChatLayoutModeState = {
  value: LayoutMode.SLIDE,
};

export const chatLayoutModeSlice = createSlice({
  name: 'chatLayoutMode',
  initialState,
  reducers: {
    setChatLayoutMode: (state, action: PayloadAction<LayoutMode>) => {
      state.value = action.payload;
    },
  },
});

export const { setChatLayoutMode } = chatLayoutModeSlice.actions;
export { LayoutMode };
