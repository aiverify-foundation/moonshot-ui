/* Core */
import { createLogger } from 'redux-logger';
import { llmEndpointApi } from '@/app/views/moonshot-desktop/services/llm-endpoint-api-service';
import { promptTemplateApi } from '@/app/views/moonshot-desktop/services/prompt-template-api-service';
import { sessionApi } from '@/app/views/moonshot-desktop/services/session-api-service';

const middleware = [
  sessionApi.middleware,
  promptTemplateApi.middleware,
  llmEndpointApi.middleware,
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
