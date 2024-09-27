const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const proxyPathBenchmarksExec = `${basePath}/api/v1/benchmarks`;
export const proxyPathBenchmarksGetStatus = `${basePath}/api/v1/benchmarks/status`;
export const proxyPathBenchmarksGetResults = `${basePath}/api/v1/benchmarks/results`;
export const proxyPathConnectors = `${basePath}/api/v1/connectors`;
export const proxyPathContextStrats = `${basePath}/api/v1/context-strategies`;
export const proxyPathSessions = `${basePath}/api/v1/sessions`;
export const proxyPathDatasets = `${basePath}/api/v1/datasets`;
export const proxyPathMetrics = `${basePath}/api/v1/metrics`;
export const proxyPathAttackModules = `${basePath}/api/v1/attack-modules`;
export const proxyPathRunners = `${basePath}/api/v1/runners`;
export const proxyPathSseStream = `${basePath}/api/v1/stream`;
export const proxyPathCookbooks = `${basePath}/api/v1/cookbooks`;
export const proxyPathEndpoints = `${basePath}/api/v1/endpoints`;
export const proxyPathRecipes = `${basePath}/api/v1/recipes`;
export const proxyPathPromptTemplates = `${basePath}/api/v1/prompt-templates`;
