import { AppEventTypes } from '@apptypes/enums';
import { NextResponse } from 'next/server';
import { getSSEWriter } from './sse_writer';
import { BenchMarkEvents } from '../../types';
import {
  listAllListeners,
  removeAllBenchmarkListeners,
  removeAllSystemListeners,
  subscribeToBenchmarkEvent,
} from '../../event-emitter';

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const sseWriter = getSSEWriter(writer, encoder);

  const eventStream = async (notifier: BenchMarkEvents) => {
    removeAllBenchmarkListeners();
    removeAllSystemListeners();
    subscribeToBenchmarkEvent((data) => {
      console.log('benchmark-update', data);
      notifier.update({
        data,
        event: AppEventTypes.BENCHMARK_UPDATE,
      });
    });
    listAllListeners();
    notifier.update({
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
