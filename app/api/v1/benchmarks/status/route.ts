import { AppEventTypes } from '@/app/types/enums';
import { basePathBenchmarks, hostURL } from '@api/constants';
import { appEventBus } from '@api/eventbus';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json()) as TestStatus;
  console.debug('Webhook callback invoked', {
    current_runner_id: body.current_runner_id,
    current_runner_name: body.current_runner_id,
    current_progress: body.current_progress,
    current_status: body.current_status,
  });
  appEventBus.emit(AppEventTypes.BENCHMARK_UPDATE, body);
  return new Response(JSON.stringify({ msg: 'Updates sent to SSE writer' }));
}

export async function GET() {
  const response = await fetch(`${hostURL}${basePathBenchmarks}/status`, {
    method: 'GET',
  });
  return response;
}
