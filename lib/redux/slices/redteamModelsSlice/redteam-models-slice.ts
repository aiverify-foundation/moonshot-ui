import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type RedteamModelsState = {
  entities: LLMEndpoint[];
};

const initialState: RedteamModelsState = {
  entities: [],
};

export const redteamModelsStateSlice = createSlice({
  name: 'redteamModels',
  initialState,
  reducers: {
    addRedteamModels: (state, action: PayloadAction<LLMEndpoint[]>) => {
      state.entities.unshift(...action.payload);
    },
    removeRedteamModels: (state, action: PayloadAction<LLMEndpoint[]>) => {
      state.entities = state.entities.filter(
        (entity) =>
          !action.payload.find(
            (payloadEntity) => payloadEntity.id === entity.id
          )
      );
    },
    resetRedteamModels: (state) => {
      state.entities = [];
    },
  },
});

export const { addRedteamModels, removeRedteamModels, resetRedteamModels } =
  redteamModelsStateSlice.actions;
