import { RunnerDetailWebApiModel, RunnerWebApiModel } from '@/app/api/types';
import { ErrorWithMessage, toErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import BenchmarkRunsView from '@/app/views/benchmarking/benchmarkRunsView';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchBenchmarkRuns(): Promise<
  ApiResult<Runner[]> | ErrorWithMessage
> {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRunners}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<RunnerWebApiModel[]>(response);
  if ('error' in result) {
    throw result.error;
  }
  const runners: RunnerWebApiModel[] = (
    result as ApiResult<RunnerWebApiModel[]>
  ).data;
  const runnerPromises = runners.map(async (runner) => {
    try {
      const runnerDetailsResponse = await fetch(
        `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${runner.id}/runs/1`
      );
      const result = await processResponse<RunnerDetailWebApiModel>(
        runnerDetailsResponse
      );
      if ('error' in result) {
        throw Promise.reject(result.error);
      }
      return {
        ...runner,
        ...(result as ApiResult<RunnerDetailWebApiModel>).data,
        database_file: undefined,
      } as Runner;
    } catch (error) {
      throw Promise.reject(error);
    }
  });

  try {
    const mergedRunners = await Promise.all(runnerPromises);
    const filteredBenchmarkRunners = mergedRunners.filter(
      (runner) =>
        runner.runner_args &&
        runner.runner_args.runner_processing_module == 'benchmarking'
    );
    return { status: 200, data: filteredBenchmarkRunners } as ApiResult<
      Runner[]
    >;
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
  if ('error' in result) {
    throw result.error;
  }
  return result;
}

export default async function CookbooksPage() {
  const result = await fetchBenchmarkRuns();
  if ('error' in result) {
    throw result.error;
  }

  const idsResult = await fetchBenchmarkResultIds();
  if ('error' in idsResult) {
    throw idsResult.error;
  }

  return (
    <BenchmarkRunsView
      runners={(result as ApiResult<Runner[]>).data}
      resultIds={(idsResult as ApiResult<string[]>).data}
    />
  );
}
