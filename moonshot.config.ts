type MoonshotConfig = {
  initialCookbooks: string[];
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
  };
};

const config: MoonshotConfig = {
  initialCookbooks: [
    'evaluation-catalogue-cookbook',
    'chinese-cookbook',
    'tamil-language-cookbook',
    'leaderboard-cookbook',
    'truthful-cookbook',
  ],
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
  },
};

export default config;
