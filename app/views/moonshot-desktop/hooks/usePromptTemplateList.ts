import { useGetPromptTemplatesQuery } from '@/app/views/moonshot-desktop/services/prompt-template-api-service';

export default function usePromptTemplateList() {
  const { data, error, isLoading } = useGetPromptTemplatesQuery();
  let promptTemplates: PromptTemplate[] = [];
  if (data !== undefined) {
    promptTemplates = data;
  }
  return { promptTemplates, error, isLoading };
}
