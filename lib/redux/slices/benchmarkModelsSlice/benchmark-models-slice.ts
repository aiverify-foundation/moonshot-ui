import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type BenchmarkModelsState = {
  entities: LLMEndpoint[];
};

const initialState: BenchmarkModelsState = {
  entities: [],
};

export const benchmarkModelsStateSlice = createSlice({
  name: 'activeSession',
  initialState,
  reducers: {
    addBenchmarkModels: (state, action: PayloadAction<LLMEndpoint[]>) => {
      state.entities.unshift(...action.payload);
    },
    removeBenchmarkModels: (state, action: PayloadAction<LLMEndpoint[]>) => {
      state.entities = state.entities.filter(
        (entity) =>
          !action.payload.find(
            (payloadEntity) => payloadEntity.name === entity.name
          )
      );
    },
    resetBenchmarkModels: (state) => {
      state.entities = [];
    },
  },
});

export const {
  addBenchmarkModels,
  removeBenchmarkModels,
  resetBenchmarkModels,
} = benchmarkModelsStateSlice.actions;
