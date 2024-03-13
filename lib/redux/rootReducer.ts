/* Instruments */
import { benchmarkRunApi } from '@/app/services/benchmark-api-service';
import { cookbookApi } from '@/app/services/cookbook-api-service';
import { llmEndpointApi } from '@/app/services/llm-endpoint-api-service';
import { promptTemplateApi } from '@/app/services/prompt-template-api-service';
import { recipeApi } from '@/app/services/recipe-api-service';
import { sessionApi } from '@/app/services/session-api-service';
import {
  activeSessionSlice,
  benchmarkCookbooksStateSlice,
  benchmarkModelsStateSlice,
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
  benchmarkModels: benchmarkModelsStateSlice.reducer,
  benchmarkCookbooks: benchmarkCookbooksStateSlice.reducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
  [promptTemplateApi.reducerPath]: promptTemplateApi.reducer,
  [llmEndpointApi.reducerPath]: llmEndpointApi.reducer,
  [cookbookApi.reducerPath]: cookbookApi.reducer,
  [recipeApi.reducerPath]: recipeApi.reducer,
  [benchmarkRunApi.reducerPath]: benchmarkRunApi.reducer,
};
