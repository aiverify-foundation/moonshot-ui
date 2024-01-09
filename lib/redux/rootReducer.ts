/* Instruments */
import { sessionApi } from '@/app/views/moonshot-desktop/services/session-api-service';
import { sessionsSlice } from './slices/sessionsSlice/sessions-slice';

export const reducer = {
  sessions: sessionsSlice.reducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
};
