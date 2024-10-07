import { ErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';

export async function fetchEndpoints(): Promise<
  ApiResult<LLMEndpoint[]> | ErrorWithMessage
> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<LLMEndpoint[]>(response);
  return result;
}
