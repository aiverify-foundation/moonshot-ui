import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import { ContextStrategiesList } from './contextStrategiesList';
export const dynamic = 'force-dynamic';

async function fetchContextStrategies() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathContextStrategies}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<ContextStrategy[]>(response);
  return result;
}

export default async function PromptTemplatesPage() {
  const result = await fetchContextStrategies();
  if ('error' in result) {
    throw result.error;
  }

  return (
    <ContextStrategiesList
      strategies={(result as ApiResult<ContextStrategy[]>).data}
    />
  );
}
