import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import { PromptTemplatesList } from './promptTemplatesList';
export const dynamic = 'force-dynamic';

async function fetchPromptTemplates() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathPromptTemplates}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<PromptTemplate[]>(response);
  return result;
}

export default async function PromptTemplatesPage() {
  const result = await fetchPromptTemplates();
  if ('error' in result) {
    throw result.error;
  }

  return (
    <PromptTemplatesList
      templates={(result as ApiResult<PromptTemplate[]>).data}
    />
  );
}
