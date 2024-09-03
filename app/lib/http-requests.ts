import { ErrorWithMessage, toErrorWithMessage } from './error-utils';

type ApiResult<T> = {
  status: number;
  data: T;
};

async function processResponse<T>(
  response: Response
): Promise<ApiResult<T> | ErrorWithMessage> {
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
    let error = '';
    if (result.data && result.data.error) {
      error = result.data.error;
    } else if (result.data && result.data.detail) {
      error = result.data.detail;
    }

    return toErrorWithMessage({
      status: response.status,
      statusText: response.statusText,
      error,
    });
  }
}

export { processResponse };
export type { ApiResult };
