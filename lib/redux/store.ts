/* Core */
import {
  configureStore,
  type ThunkAction,
  type Action,
} from '@reduxjs/toolkit';
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  type TypedUseSelectorHook,
} from 'react-redux';

/* Instruments */
import { middleware } from './middleware';
import { reducer } from './rootReducer';

export const applicationStore = configureStore({
  reducer,
  // eslint-disable-next-line
  middleware: (getDefaultMiddleware): any => {
    return getDefaultMiddleware().concat(middleware);
  },
});
export const useAppDispatch = () => useReduxDispatch<ReduxDispatch>();
export const useAppSelector: TypedUseSelectorHook<ApplicationState> =
  useReduxSelector;

/* Types */
export type ApplicationStore = typeof applicationStore;
export type ApplicationState = ReturnType<typeof applicationStore.getState>;
export type ReduxDispatch = typeof applicationStore.dispatch;
export type ReduxThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  ApplicationState,
  unknown,
  Action
>;
