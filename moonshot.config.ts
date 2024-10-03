type MoonshotConfig = {
  baselineSelectedCookbooks: string[];
  estimatedPromptResponseTime: number;
  cookbookCategoriesTabs: {
    id: string;
    label: string;
    categoryNames: string[];
  }[];
  cookbooksOrder: string[];
  cookbookTags: {
    [cookbookId: string]: string[];
  };
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
    basePathBookmarks: string;
    basePathMetrics: string;
  };
};

const config: MoonshotConfig = {
  baselineSelectedCookbooks: [
    'mlc-ai-safety',
    'common-risk-easy',
    'common-risk-hard',
  ],
  cookbooksOrder: ['singapore-context', 'mlc-ai-safety'],
  cookbookTags: {
    'common-risk-easy': [
      'Bias',
      'Toxicity',
      'General knowledge',
      'Common sense morality',
      'Jailbreak',
    ],
    'common-risk-hard': [
      'Bias',
      'Toxicity',
      'General knowledge',
      'Common sense morality',
      'Jailbreak',
    ],
    'legal-summarisation': ['Summarisation', 'Legal'],
    'leaderboard-cookbook': [
      'MMLU',
      'Truthfulness',
      'Common sense reasoning',
      'Science',
      'Math',
    ],
    'medical-llm-leaderboard': ['Medical board exam'],
    'mlc-ai-safety': [
      'Dangerous or violent recommendations',
      'Child abuse and exploitation',
      'Hate',
      'Non-violent crimes',
      'Sex-related crimes',
      'Suicide and self harm',
    ],
    'singapore-context': ['General knowledge', 'Singapore'],
    'tamil-language-cookbook': [
      'Tamil comprehension',
      'Tamil generation',
      'Tamil literature',
    ],
  },
  cookbookCategoriesTabs: [
    { id: 'capability', label: 'Capability', categoryNames: ['capability'] },
    {
      id: 'trustAndSafety',
      label: 'Trust & Safety',
      categoryNames: ['Trust & Safety'],
    },
    {
      id: 'others',
      label: 'Others',
      categoryNames: ['exclude:capability', 'exclude:Trust & Safety'],
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
    basePathMetrics: '/api/v1/metrics',
  },
};

export default config;
