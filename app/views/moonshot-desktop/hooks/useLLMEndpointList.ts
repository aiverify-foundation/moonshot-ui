import { useGetLLMEndpointsQuery } from '@/app/views/moonshot-desktop/services/llm-endpoint-api-service';

export default function useLLMEndpointList() {
  const { data, error, isLoading } = useGetLLMEndpointsQuery();
  let llmEndpoints: LLMEndpoint[] = [];
  if (data !== undefined) {
    llmEndpoints = data;
  }
  return { llmEndpoints, error, isLoading };
}
