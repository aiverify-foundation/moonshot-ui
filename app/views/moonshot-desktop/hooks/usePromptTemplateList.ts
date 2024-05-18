import { useGetAllPromptTemplatesQuery } from '@/app/services/prompt-template-api-service';

export default function usePromptTemplateList() {
  const { data, error, isLoading, refetch } = useGetAllPromptTemplatesQuery();
  let promptTemplates: PromptTemplate[] = [];
  if (data !== undefined) {
    promptTemplates = data;
  }
  return { promptTemplates, error, isLoading, refetch };
}
