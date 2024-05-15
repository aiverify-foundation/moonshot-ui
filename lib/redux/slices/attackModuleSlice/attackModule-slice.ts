import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type AttackModuleState = {
  entity: AttackModule | undefined;
};

const initialState: AttackModuleState = {
  entity: undefined,
};

export const attackModuleStateSlice = createSlice({
  name: 'attackModule',
  initialState,
  reducers: {
    setAttackModule: (state, action: PayloadAction<AttackModule>) => {
      state.entity = action.payload;
    },
    resetAttackModule: (state) => {
      state.entity = undefined;
    },
  },
});

export const { setAttackModule, resetAttackModule } =
  attackModuleStateSlice.actions;
