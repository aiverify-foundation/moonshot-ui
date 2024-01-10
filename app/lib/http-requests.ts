import { ErrorWithMessage, toErrorWithMessage } from './error-utils';

type ApiResult<T> = {
  status: number;
  data: T;
};

async function handleResponseBody<T>(response: Response): Promise<ApiResult<T> | ErrorWithMessage> {
  let result;
  try {
    const data = await response.json();
    result = { status: response.status, data };
  } catch (err) {
    result = toErrorWithMessage(err);
    return result;
  }

  if (response.ok) {
    return result;
  } else {
    return toErrorWithMessage({
      status: response.status,
      statusText: response.statusText,
      error: result.data && result.data.error ? result.data.error : undefined,
    });
  }
}

export { handleResponseBody };
export type { ApiResult };
