type MoonshotConfig = {
  baselineSelectedCookbooks: string[];
  estimatedPromptResponseTime: number;
  cookbookCategoriesTabs: {
    id: string;
    label: string;
    categoryNames: string[];
  }[];
  cookbooksOrder: string[];
  webAPI: {
    hostURL: string;
    basePathSessions: '/api/v1/sessions';
    basePathPromptTemplates: '/api/v1/prompt-templates';
    basePathConnectors: '/api/v1/connectors';
    basePathLLMEndpoints: '/api/v1/llm-endpoints';
    basePathCookbooks: '/api/v1/cookbooks';
    basePathContextStrategies: '/api/v1/context-strategies';
    basePathRecipes: '/api/v1/recipes';
    basePathBenchmarks: '/api/v1/benchmarks';
    basePathRunners: '/api/v1/runners';
    basePathAttackModules: '/api/v1/attack-modules/metadata';
    basePathBookmarks: '/api/v1/bookmarks';
  };
};

const config: MoonshotConfig = {
  baselineSelectedCookbooks: [
    'mlc-ai-safety',
    'common-risk-easy',
    'common-risk-hard',
  ],
  cookbooksOrder: ['singapore-context', 'mlc-ai-safety'],
  cookbookCategoriesTabs: [
    { id: 'imdaStarterKit', label: 'IMDA Starter Kit', categoryNames: ['IMDA Starter Kit'] },
    { id: 'capability', label: 'Capability', categoryNames: ['capability'] },
    {
      id: 'trustAndSafety',
      label: 'Trust & Safety',
      categoryNames: ['Trust & Safety'],
    },
    {
      id: 'others',
      label: 'Others',
      categoryNames: ['exclude:IMDA Starter Kit', 'exclude:capability', 'exclude:Trust & Safety'],
    },
  ],
  estimatedPromptResponseTime: 1, // seconds
  webAPI: {
    hostURL: process.env.MOONSHOT_API_URL || 'http://localhost:5000',
    basePathSessions: '/api/v1/sessions',
    basePathPromptTemplates: '/api/v1/prompt-templates',
    basePathConnectors: '/api/v1/connectors',
    basePathLLMEndpoints: '/api/v1/llm-endpoints',
    basePathCookbooks: '/api/v1/cookbooks',
    basePathContextStrategies: '/api/v1/context-strategies',
    basePathRecipes: '/api/v1/recipes',
    basePathBenchmarks: '/api/v1/benchmarks',
    basePathRunners: '/api/v1/runners',
    basePathAttackModules: '/api/v1/attack-modules/metadata',
    basePathBookmarks: '/api/v1/bookmarks',
  },
};

export default config;
