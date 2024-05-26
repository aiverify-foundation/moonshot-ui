import React from 'react';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import { EndpointsViewList } from './endpointsViewList';

async function fetchEndpoints() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<LLMEndpoint[]>(response);
  return result;
}

export default async function BenchmarkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await fetchEndpoints();
  if ('error' in result) {
    throw result.error;
  }
  const allEndpoints = (result as ApiResult<LLMEndpoint[]>).data;
  return (
    <EndpointsViewList endpoints={allEndpoints}>{children}</EndpointsViewList>
  );
}
