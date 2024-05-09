import { useGetLLMEndpointsQuery } from '@/app/services/llm-endpoint-api-service';

export default function useModelsList() {
  const { data, error, isLoading, refetch } = useGetLLMEndpointsQuery();
  let models: LLMEndpoint[] = [];
  if (data !== undefined) {
    models = data;
  }
  return { models, error, isLoading, refetch };
}
