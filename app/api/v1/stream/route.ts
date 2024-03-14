import { NextResponse, NextRequest } from 'next/server';
import { AppEventTypes } from '@apptypes/enums';
import { getSSEWriter } from './sse_writer';
import {
  listAllListeners,
  removeAllBenchmarkListeners,
  removeAllSystemListeners,
  subscribeToBenchmarkEvent,
} from '@api/event-emitter';
import { BenchMarkEvents, SystemEvents } from '@api/types';

export async function GET(req: NextRequest, res: NextResponse) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const sseWriter = getSSEWriter(writer, encoder);
  let isConnectionClosed = false;

  const eventStream = async (notifier: BenchMarkEvents | SystemEvents) => {
    if (isConnectionClosed) {
      return;
    }
    removeAllBenchmarkListeners();
    removeAllSystemListeners();

    subscribeToBenchmarkEvent<CookbookTestRunProgress>((data) => {
      console.debug('Data received from webhook');
      try {
        if ('exec_id' in data) {
          (notifier as BenchMarkEvents).update({
            data,
            event: AppEventTypes.BENCHMARK_UPDATE,
          });
        } else {
          (notifier as SystemEvents).update({
            data,
            event: AppEventTypes.SYSTEM_UPDATE,
          });
        }
      } catch (error) {
        console.error('Error writing to SSE stream', error);
      }
    });

    // Heartbeat mechanism
    const heartbeatInterval = setInterval(() => {
      console.log('Sending SSE heartbeat');
      writer.write(encoder.encode(': \n\n')).catch((error) => {
        console.error('Error writing heartbeat to SSE stream', error);
        clearInterval(heartbeatInterval);
        isConnectionClosed = true;
        removeAllBenchmarkListeners();
        removeAllSystemListeners();
      });
    }, 8000);

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
