import { createSlice } from '@reduxjs/toolkit';

type SessionSliceState = {
  entities: Session[];
};

const initialState: SessionSliceState = {
  entities: [],
};

export const sessionSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    // Define reducers here
  },
});
