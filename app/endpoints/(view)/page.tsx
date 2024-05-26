import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import { EndpointDetails } from './endpointDetails';
export const dynamic = 'force-dynamic';

async function fetchEndpoints() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}`,
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

  const allEndpoints = (result as ApiResult<LLMEndpoint[]>).data;
  return <EndpointDetails endpoint={allEndpoints[0]} />;
}
