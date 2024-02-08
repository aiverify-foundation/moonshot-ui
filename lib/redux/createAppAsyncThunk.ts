/* Core */
import { createAsyncThunk } from '@reduxjs/toolkit';

/* Instruments */
import type { ApplicationState, ReduxDispatch } from './store';

/**
 * ? A utility function to create a typed Async Thunk Actions.
 */
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: ApplicationState;
  dispatch: ReduxDispatch;
  rejectValue: string;
}>();
