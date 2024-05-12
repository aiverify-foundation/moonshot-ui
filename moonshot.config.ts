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
  };
};

const config: MoonshotConfig = {
  baselineSelectedCookbooks: [
    'legal-summarisation',
    'cbbq-amb-cookbook',
    'cbbq-disamb-cookbook',
  ],
  defaultCookbooksForSelection: [
    'evaluation-catalogue-cookbook',
    'chinese-cookbook',
    'tamil-language-cookbook',
    'leaderboard-cookbook',
    'truthful-cookbook',
  ],
  cookbookCategoriesTabs: [
    { id: 'quality', label: 'Quality', categoryNames: ['quality'] },
    { id: 'capability', label: 'Capability', categoryNames: ['capability'] },
    {
      id: 'trustAndSafety',
      label: 'Trust & Safety',
      categoryNames: ['Trust & Safety'],
    },
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
  estimatedPromptResponseTime: 10, // seconds
  webAPI: {
    hostURL: process.env.MOONSHOT_API_URL || 'http://localhost:5000',
    basePathSessions: '/api/v1/sessions',
    basePathPromptTemplates: '/api/v1/prompt_templates',
    basePathConnectors: '/api/v1/connectors',
    basePathLLMEndpoints: '/api/v1/llm-endpoints',
    basePathCookbooks: '/api/v1/cookbooks',
    basePathContextStrategies: '/api/v1/context_strategies',
    basePathRecipes: '/api/v1/recipes',
    basePathBenchmarks: '/api/v1/benchmarks',
    basePathRunners: '/api/v1/runners',
  },
};

export default config;
