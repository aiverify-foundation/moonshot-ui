import { ApiResult, processResponse } from '@/app/lib/http-requests';
import { EndpointsViewList } from '@/app/views/models-management/endpointsViewList';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchEndpoints() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}?count=true`,
    { cache: 'no-store' }
  );
  const result = await processResponse<LLMEndpoint[]>(response);
  return result;
}

export default async function EndpointsHomepage() {
  const result = await fetchEndpoints();
  if ('error' in result) {
    throw result.error;
  }
  return (
    <EndpointsViewList endpoints={(result as ApiResult<LLMEndpoint[]>).data} />
  );
}
