import { createSlice } from '@reduxjs/toolkit';

type DarkMode = {
  value: boolean;
};

const initialState: DarkMode = {
  value: true,
};

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggleDarkMode } = darkModeSlice.actions;
