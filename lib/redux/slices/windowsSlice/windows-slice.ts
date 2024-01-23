import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type WindowsState = {
  map: Record<string, WindowData>;
  focusedWindowId: string | null;
};

const initialState: WindowsState = {
  map: {},
  focusedWindowId: null,
};

export const windowsSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    updateWindows: (state, action: PayloadAction<Record<string, WindowData>>) => {
      const properties = Object.keys(action.payload);
      properties.forEach((prop) => (state.map[prop] = action.payload[prop]));
    },
    updateFocusedWindowId: (state, action: PayloadAction<string>) => {
      state.focusedWindowId = action.payload;
    },
  },
});

export const { updateWindows, updateFocusedWindowId } = windowsSlice.actions;
