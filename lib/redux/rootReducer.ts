/* Instruments */
import { llmEndpointApi } from '@/app/views/moonshot-desktop/services/llm-endpoint-api-service';
import { promptTemplateApi } from '@/app/views/moonshot-desktop/services/prompt-template-api-service';
import { sessionApi } from '@/app/views/moonshot-desktop/services/session-api-service';
import { activeSessionSlice } from './slices/activeSessionSlice';
import { chatHistorySlice } from './slices/chatHistorySlice';
import { chatLayoutModeSlice } from './slices/chatLayoutModeSlice';
import { darkModeSlice } from './slices/darkModeSlice';
import { sessionsSlice } from './slices/sessionsSlice/sessions-slice';
import { windowsSlice } from './slices/windowsSlice';

export const reducer = {
  sessions: sessionsSlice.reducer,
  activeSession: activeSessionSlice.reducer,
  chatHistory: chatHistorySlice.reducer,
  windows: windowsSlice.reducer,
  darkMode: darkModeSlice.reducer,
  chatLayoutMode: chatLayoutModeSlice.reducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
  [promptTemplateApi.reducerPath]: promptTemplateApi.reducer,
  [llmEndpointApi.reducerPath]: llmEndpointApi.reducer,
};
