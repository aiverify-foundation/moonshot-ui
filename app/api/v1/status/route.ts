import { AppEventTypes } from '@/app/types/enums';
import { triggerEvent } from '../../event-emitter';

export async function POST(request: Request) {
  const body = await request.json();
  triggerEvent(AppEventTypes.BENCHMARK_UPDATE, body);
  return new Response('ok');
}
