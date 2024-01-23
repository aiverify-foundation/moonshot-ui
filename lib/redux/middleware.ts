/* Core */
import { promptTemplateApi } from '@/app/views/moonshot-desktop/services/prompt-template-api-service';
import { sessionApi } from '@/app/views/moonshot-desktop/services/session-api-service';
import { createLogger } from 'redux-logger';

const middleware = [
  sessionApi.middleware,
  promptTemplateApi.middleware,
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
