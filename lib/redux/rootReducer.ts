/* Instruments */
import { attackModulesApi } from '@/app/services/attack-modules-api-service';
import { benchmarkRunApi } from '@/app/services/benchmark-api-service';
import { connectorApi } from '@/app/services/connector-api-service';
import { contextStratApi } from '@/app/services/contextstrat-api-service';
import { cookbookApi } from '@/app/services/cookbook-api-service';
import { datasetApi } from '@/app/services/dataset-api-service';
import { llmEndpointApi } from '@/app/services/llm-endpoint-api-service';
import { metricApi } from '@/app/services/metric-api-service';
import { promptTemplateApi } from '@/app/services/prompt-template-api-service';
import { recipeApi } from '@/app/services/recipe-api-service';
import { runnerApi } from '@/app/services/runner-api-service';
import { sessionApi } from '@/app/services/session-api-service';
import { statusApi } from '@/app/services/status-api-service';
import {
  activeResultSlice,
  activeSessionSlice,
  benchmarkCookbooksStateSlice,
  benchmarkModelsStateSlice,
  redteamModelsStateSlice,
  attackModuleStateSlice,
  chatLayoutModeSlice,
  darkModeSlice,
  sessionsSlice,
  windowsSlice,
} from './slices';

export const reducer = {
  sessions: sessionsSlice.reducer,
  activeSession: activeSessionSlice.reducer,
  activeResult: activeResultSlice.reducer,
  windows: windowsSlice.reducer,
  darkMode: darkModeSlice.reducer,
  chatLayoutMode: chatLayoutModeSlice.reducer,
  benchmarkModels: benchmarkModelsStateSlice.reducer,
  benchmarkCookbooks: benchmarkCookbooksStateSlice.reducer,
  redteamModels: redteamModelsStateSlice.reducer,
  attackModule: attackModuleStateSlice.reducer,
  [sessionApi.reducerPath]: sessionApi.reducer,
  [promptTemplateApi.reducerPath]: promptTemplateApi.reducer,
  [llmEndpointApi.reducerPath]: llmEndpointApi.reducer,
  [cookbookApi.reducerPath]: cookbookApi.reducer,
  [recipeApi.reducerPath]: recipeApi.reducer,
  [benchmarkRunApi.reducerPath]: benchmarkRunApi.reducer,
  [statusApi.reducerPath]: statusApi.reducer,
  [connectorApi.reducerPath]: connectorApi.reducer,
  [contextStratApi.reducerPath]: contextStratApi.reducer,
  [datasetApi.reducerPath]: datasetApi.reducer,
  [metricApi.reducerPath]: metricApi.reducer,
  [attackModulesApi.reducerPath]: attackModulesApi.reducer,
  [runnerApi.reducerPath]: runnerApi.reducer,
};
