import { AppEventTypes } from '@/app/types/enums';
import { triggerEvent } from '@api/event-emitter';

export async function POST(request: Request) {
  const body = (await request.json()) as CookbookTestRunProgress;
  triggerEvent(AppEventTypes.BENCHMARK_UPDATE, body);
  return new Response(
    JSON.stringify({ msg: 'Updates streamed to SSE writer' })
  );
}
