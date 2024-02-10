/* Instruments */
import { llmEndpointApi } from '@/app/views/moonshot-desktop/services/llm-endpoint-api-service';
import { promptTemplateApi } from '@/app/views/moonshot-desktop/services/prompt-template-api-service';
import { sessionApi } from '@/app/views/moonshot-desktop/services/session-api-service';
import {
  activeSessionSlice,
  chatLayoutModeSlice,
  darkModeSlice,
  sessionsSlice,
  windowsSlice,
} from './slices';

export const reducer = {
  sessions: sessionsSlice.reducer,
  activeSession: activeSessionSlice.reducer,
  windows: windowsSlice.reducer,
  darkMode: darkModeSlice.reducer,
  chatLayoutMode: chatLayoutModeSlice.reducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
  [promptTemplateApi.reducerPath]: promptTemplateApi.reducer,
  [llmEndpointApi.reducerPath]: llmEndpointApi.reducer,
};
