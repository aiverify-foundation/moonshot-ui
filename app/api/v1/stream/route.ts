import { AppEventTypes } from '@apptypes/enums';
import { NextResponse } from 'next/server';
import { getSSEWriter } from './sse_writer';
import {
  listAllListeners,
  removeAllBenchmarkListeners,
  removeAllSystemListeners,
  subscribeToBenchmarkEvent,
} from '@api/event-emitter';
import { BenchMarkEvents, SystemEvents } from '@api/types';

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const sseWriter = getSSEWriter(writer, encoder);

  const eventStream = async (notifier: BenchMarkEvents | SystemEvents) => {
    removeAllBenchmarkListeners();
    removeAllSystemListeners();
    subscribeToBenchmarkEvent<CookbookTestRunProgress>((data) => {
      console.log('benchmark-update', data);
      if ('exec_id' in data) {
        (notifier as BenchMarkEvents).update({
          data,
          event: AppEventTypes.BENCHMARK_UPDATE,
        });
      } else {
        console.error('Invalid data format for cookbookTestRunProgress', data);
      }
    });
    // listAllListeners();
    (notifier as SystemEvents).update({
      data: { msg: 'SSE init done' },
      event: AppEventTypes.SYSTEM_UPDATE,
    });
  };

  eventStream(sseWriter);

  return new NextResponse(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
