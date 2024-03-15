import { AppEventTypes } from '@/app/types/enums';
import { basePathStatusExecutor, hostURL } from '@api/constants';
import { appEventBus } from '@api/eventbus';

export async function POST(request: Request) {
  const body = (await request.json()) as TestStatus;
  console.debug('Webhook callback invoked', {
    exec_id: body.exec_id,
    exec_name: body.exec_name,
    curr_progress: body.curr_progress,
    curr_status: body.curr_status,
  });
  appEventBus.emit(AppEventTypes.BENCHMARK_UPDATE, body);
  return new Response(JSON.stringify({ msg: 'Updates sent to SSE writer' }));
}

export async function GET() {
  const response = await fetch(`${hostURL}${basePathStatusExecutor}`, {
    method: 'GET',
  });
  return response;
}
