import { AppEventTypes } from '@/app/types/enums';
import { appEventBus } from '@api/eventbus';

export async function POST(request: Request) {
  const body = (await request.json()) as CookbookTestRunProgress;
  console.debug('Webhook callback invoked', body);
  appEventBus.emit(AppEventTypes.BENCHMARK_UPDATE, body);
  return new Response(JSON.stringify({ msg: 'Updates sent to SSE writer' }));
}
