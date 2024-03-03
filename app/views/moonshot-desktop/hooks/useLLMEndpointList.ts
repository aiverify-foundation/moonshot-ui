import { useGetLLMEndpointsQuery } from '@/app/services/llm-endpoint-api-service';

export default function useLLMEndpointList() {
  const { data, error, isLoading, refetch } = useGetLLMEndpointsQuery();
  let llmEndpoints: LLMEndpoint[] = [];
  if (data !== undefined) {
    llmEndpoints = data;
  }
  return { llmEndpoints, error, isLoading, refetch };
}
