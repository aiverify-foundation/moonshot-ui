import { RunnerDetailWebApiModel, RunnerWebApiModel } from '@/app/api/types';
import BenchmarkRunsView from '@/app/benchmarking/components/benchmarkRunsView';
import { ErrorWithMessage, toErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchBenchmarkRuns(): Promise<
  ApiResult<Runner[]> | ErrorWithMessage
> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRunners}`,
    { cache: 'no-store' }
  );
  const result: ApiResult<RunnerWebApiModel[]> | ErrorWithMessage =
    await processResponse<RunnerWebApiModel[]>(response);
  if ('message' in result) {
    return result;
  }
  const runners = result.data;
  const runnerPromises = runners.map(async (runner) => {
    try {
      const runnerDetailsResponse = await fetch(
        `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${runner.id}/runs/1`
      );
      const result = await processResponse<RunnerDetailWebApiModel>(
        runnerDetailsResponse
      );
      if ('message' in result) {
        return result;
      }
      return {
        ...runner,
        ...result.data,
        database_file: undefined,
      };
    } catch (error) {
      return toErrorWithMessage(error);
    }
  });

  try {
    const mergedRunners = await Promise.all(runnerPromises);
    const filteredCookbookBenchmarkRunners = mergedRunners.filter(
      (response) =>
        'runner_args' in response &&
        response.runner_args.runner_processing_module == 'benchmarking' &&
        'cookbooks' in response.runner_args
    );
    return { status: 200, data: filteredCookbookBenchmarkRunners as Runner[] };
  } catch (error) {
    const errorWithMsg = toErrorWithMessage(error);
    return errorWithMsg;
  }
}

async function fetchBenchmarkResultIds(): Promise<
  ApiResult<string[]> | ErrorWithMessage
> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}/results/name`,
    { cache: 'no-store' }
  );
  const result = await processResponse<string[]>(response);
  if ('message' in result) {
    return result;
  }
  return result;
}

export default async function BenchmarkRunsPage() {
  const result = await fetchBenchmarkRuns();
  if ('message' in result) {
    throw result.message;
  }

  const idsResult = await fetchBenchmarkResultIds();
  if ('message' in idsResult) {
    throw idsResult.message;
  }

  return (
    <BenchmarkRunsView
      runners={result.data}
      resultIds={idsResult.data}
    />
  );
}
