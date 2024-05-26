type MoonshotConfig = {
  baselineSelectedCookbooks: string[];
  defaultCookbooksForSelection: string[];
  estimatedPromptResponseTime: number;
  cookbookCategoriesTabs: {
    id: string;
    label: string;
    categoryNames: string[];
  }[];
  webAPI: {
    hostURL: string;
    basePathSessions: string;
    basePathPromptTemplates: string;
    basePathConnectors: string;
    basePathLLMEndpoints: string;
    basePathCookbooks: string;
    basePathContextStrategies: string;
    basePathRecipes: string;
    basePathBenchmarks: string;
    basePathRunners: string;
    basePathAttackModules: string;
  };
};

const config: MoonshotConfig = {
  baselineSelectedCookbooks: [
    'mlc-ai-safety',
    'common-risk-easy',
    'common-risk-hard',
  ],
  defaultCookbooksForSelection: [
    'mlc-ai-safety',
    'common-risk-easy',
    'common-risk-hard',
    'chinese-safety-cookbook',
    'tamil-language-cookbook',
    'leaderboard-cookbook',
    'legal-summarisation',
    'medical-llm-leaderboard',
    'singapore-context',
  ],
  cookbookCategoriesTabs: [
    { id: 'capability', label: 'Capability', categoryNames: ['capability'] },
    {
      id: 'trustAndSafety',
      label: 'Trust & Safety',
      categoryNames: ['Trust & Safety'],
    },
    { id: 'quality', label: 'Quality', categoryNames: ['quality'] },
    {
      id: 'others',
      label: 'Others',
      categoryNames: [
        'exclude:quality',
        'exclude:capability',
        'exclude:Trust & Safety',
      ],
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
  },
};

export default config;
