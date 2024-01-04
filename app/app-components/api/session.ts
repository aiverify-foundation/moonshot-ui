import { Session } from '@types/session';
import { ErrorWithMessage } from '@lib/error-utils';
import { ApiResult, handleResponseBody } from '@lib/http-requests';

const host = process.env.MOONSHOT_API_URL || 'http://localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const basePath = '/api/v1/sessions';

async function createSession(
  name: string,
  description: string,
  endpoints: string[]
): Promise<ApiResult<Session> | ErrorWithMessage> {
  const response = await fetch(`${host}:${port}${basePath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      description: description,
      endpoints: endpoints,
    }),
  });
  const sessionData = await handleResponseBody<Session>(response);
  return sessionData;
}

export { createSession };
