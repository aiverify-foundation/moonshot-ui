export function getEndpointsFromRequiredConfig(
  requiredConfig: RequiredConfig | null
): string[] {
  if (!requiredConfig) {
    return [];
  }
  const endpoints: string[] = [];
  if (requiredConfig.endpoints) {
    endpoints.push(...requiredConfig.endpoints);
  }
  if (requiredConfig.configurations?.embeddings) {
    requiredConfig.configurations.embeddings.forEach((embeddingEndpoint) => {
      if (!endpoints.includes(embeddingEndpoint)) {
        endpoints.push(embeddingEndpoint);
      }
    });
  }
  return endpoints;
}

export function getEmbeddingEndpointsFromRequiredConfig(
  requiredConfig: RequiredConfig | null
): string[] {
  if (!requiredConfig?.configurations?.embeddings) {
    return [];
  }
  return requiredConfig.configurations.embeddings;
}
