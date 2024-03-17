import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type WindowsState = {
  map: Record<string, WindowData>;
  focusedWindowId: string | null;
  openedWindowIds: string[];
};

const initialState: WindowsState = {
  map: {},
  focusedWindowId: null,
  openedWindowIds: [],
};

export const windowsSlice = createSlice({
  name: 'windows',
  initialState,
  reducers: {
    updateWindows: (
      state,
      action: PayloadAction<Record<string, WindowData>>
    ) => {
      const properties = Object.keys(action.payload);
      properties.forEach((prop) => (state.map[prop] = action.payload[prop]));
    },
    updateFocusedWindowId: (state, action: PayloadAction<string>) => {
      state.focusedWindowId = action.payload;
    },
    addOpenedWindowId: (state, action: PayloadAction<string>) => {
      state.openedWindowIds.unshift(action.payload);
    },
    removeOpenedWindowId: (state, action: PayloadAction<string>) => {
      state.openedWindowIds = state.openedWindowIds.filter(
        (id) => id !== action.payload
      );
    },
    clearWindows: (state) => {
      state.focusedWindowId = null;
      state.openedWindowIds = [];
    },
  },
});

export const {
  updateWindows,
  updateFocusedWindowId,
  addOpenedWindowId,
  removeOpenedWindowId,
  clearWindows,
} = windowsSlice.actions;
