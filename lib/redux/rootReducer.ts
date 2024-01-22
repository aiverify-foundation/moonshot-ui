/* Instruments */
import { sessionApi } from '@/app/views/moonshot-desktop/services/session-api-service';
import { sessionsSlice } from './slices/sessionsSlice/sessions-slice';
import { activeSessionSlice } from './slices/activeSessionSlice';
import { chatHistorySlice } from './slices/chatHistorySlice';
import { windowsSlice } from './slices/windowsSlice';

export const reducer = {
  sessions: sessionsSlice.reducer,
  activeSession: activeSessionSlice.reducer,
  chatHistory: chatHistorySlice.reducer,
  windows: windowsSlice.reducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
};
