import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type BenchmarkModelsState = {
  entities: LLMEndpoint[];
};

const initialState: BenchmarkModelsState = {
  entities: [],
};

export const benchmarkModelsStateSlice = createSlice({
  name: 'benchmarkModels',
  initialState,
  reducers: {
    addBenchmarkModels: (state, action: PayloadAction<LLMEndpoint[]>) => {
      state.entities.unshift(...action.payload);
    },
    removeBenchmarkModels: (state, action: PayloadAction<LLMEndpoint[]>) => {
      state.entities = state.entities.filter(
        (entity) =>
          !action.payload.find(
            (payloadEntity) => payloadEntity.id === entity.id
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
