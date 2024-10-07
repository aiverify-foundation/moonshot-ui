import { ErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';

export async function fetchRunnerHeading(
  id?: string
): Promise<ApiResult<RunnerHeading> | ErrorWithMessage> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${id}`
  );
  const result = await processResponse(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<RunnerHeading>;
}
