import { RunnerDetailWebApiModel, RunnerWebApiModel } from '@/app/api/types';
import config from '@/moonshot.config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathRunners}`
  );
  const runners: RunnerWebApiModel[] = await response.json();
  const runnerPromises = runners.map(async (runner) => {
    const runnerDetailsResponse = await fetch(
      `${config.webAPI.hostURL}${config.webAPI.basePathRunners}/${runner.id}/runs/1`
    );
    const runnerDetails: RunnerDetailWebApiModel =
      await runnerDetailsResponse.json();
    return { ...runner, ...runnerDetails, database_file: undefined };
  });

  const mergedRunners = await Promise.all(runnerPromises);
  return new Response(JSON.stringify(mergedRunners), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
