import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type BenchmarkCookbooksState = {
  entities: Cookbook[];
};

const initialState: BenchmarkCookbooksState = {
  entities: [],
};

export const benchmarkCookbooksStateSlice = createSlice({
  name: 'benchmarkCookbooks',
  initialState,
  reducers: {
    addBenchmarkCookbooks: (state, action: PayloadAction<Cookbook[]>) => {
      state.entities.unshift(...action.payload);
    },
    removeBenchmarkCookbooks: (state, action: PayloadAction<Cookbook[]>) => {
      state.entities = state.entities.filter(
        (entity) =>
          !action.payload.find(
            (payloadEntity) => payloadEntity.id === entity.id
          )
      );
    },
    resetBenchmarkCookbooks: (state) => {
      state.entities = [];
    },
  },
});

export const {
  addBenchmarkCookbooks,
  removeBenchmarkCookbooks,
  resetBenchmarkCookbooks,
} = benchmarkCookbooksStateSlice.actions;
