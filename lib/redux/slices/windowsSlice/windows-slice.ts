import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type WindowsState = {
  map: Record<string, WindowData>;
};

const initialState: WindowsState = {
  map: {},
};

export const windowsSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    updateWindows: (state, action: PayloadAction<Record<string, WindowData>>) => {
      const properties = Object.keys(action.payload);
      properties.forEach((prop) => (state.map[prop] = action.payload[prop]));
    },
  },
});

export const { updateWindows } = windowsSlice.actions;
