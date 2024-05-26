import { notFound } from 'next/navigation';
import { EndpointDetails } from '@/app/endpoints/(view)/endpointDetails';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchEndpoints(id: string) {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}/${id}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<LLMEndpoint>(response);
  return result;
}

export default async function EndpointsHomepage({
  params,
}: {
  params: { id: string };
}) {
  const result = await fetchEndpoints(params.id);
  if ('error' in result) {
    notFound();
  }

  const selectedEndpoint = (result as ApiResult<LLMEndpoint>).data;

  if (!selectedEndpoint) {
    notFound();
  }

  return <EndpointDetails endpoint={selectedEndpoint} />;
}
