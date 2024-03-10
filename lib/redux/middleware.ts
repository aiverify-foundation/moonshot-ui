/* Core */
import { createLogger } from 'redux-logger';
import { cookbookApi } from '@/app/services/cookbook-api-service';
import { llmEndpointApi } from '@/app/services/llm-endpoint-api-service';
import { promptTemplateApi } from '@/app/services/prompt-template-api-service';
import { sessionApi } from '@/app/services/session-api-service';

const middleware = [
  sessionApi.middleware,
  promptTemplateApi.middleware,
  llmEndpointApi.middleware,
  cookbookApi.middleware,
  createLogger({
    duration: true,
    timestamp: false,
    collapsed: true,
    colors: {
      title: () => '#139BFE',
      prevState: () => '#1C5FAF',
      action: () => '#149945',
      nextState: () => '#A47104',
      error: () => '#ff0005',
    },
    predicate: () => typeof window !== 'undefined',
  }),
];

export { middleware };
