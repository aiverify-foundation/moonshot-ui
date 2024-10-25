import { CookbooksBenchmarkResult } from '@/app/benchmarking/report/types/benchmarkReportTypes';
import { ErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';

export async function fetchReport(
  id: string
): Promise<ApiResult<CookbooksBenchmarkResult> | ErrorWithMessage> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/results/${id}`,
    {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    }
  );

  const result = await processResponse<CookbooksBenchmarkResult>(response);
  if ('message' in result) {
    return result as ErrorWithMessage;
  }
  return result as ApiResult<CookbooksBenchmarkResult>;
}
