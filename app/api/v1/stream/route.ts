import { AppEventTypes } from '@apptypes/enums';
import { NextResponse } from 'next/server';
import { getSSEWriter } from './sse_writer';
import { appEventBus } from '@api/eventbus';
import { BenchMarkEvents, SystemEvents } from '@api/types';

export const dynamic = 'force-dynamic';

const stream = new TransformStream();
const writer = stream.writable.getWriter();
const encoder = new TextEncoder();
const sseWriter = getSSEWriter(writer, encoder);
let isConnectionClosed = false;

appEventBus.on(
  AppEventTypes.BENCHMARK_UPDATE,
  (data: CookbookTestRunProgress) => {
    console.log('Data received from webhook', data);
    try {
      if ('exec_id' in data) {
        (sseWriter as BenchMarkEvents).update({
          data,
          event: AppEventTypes.BENCHMARK_UPDATE,
        });
      } else {
        (sseWriter as SystemEvents).update({
          data,
          event: AppEventTypes.SYSTEM_UPDATE,
        });
      }
    } catch (error) {
      console.error('Error writing to SSE stream', error);
    }
  }
);

export async function GET() {
  // Heartbeat mechanism
  const heartbeatInterval = setInterval(() => {
    console.log('Sending SSE heartbeat');
    writer.write(encoder.encode(': \n\n')).catch(() => {
      console.error(
        'Error writing heartbeat to SSE stream. Cleaning up SSE resources.'
      );
      (sseWriter as SystemEvents).complete({
        data: { msg: 'SSE Closed' },
        event: AppEventTypes.SYSTEM_UPDATE,
      });
      clearInterval(heartbeatInterval);
      isConnectionClosed = true;
      appEventBus.removeAllListeners(AppEventTypes.BENCHMARK_UPDATE);
      appEventBus.removeAllListeners(AppEventTypes.SYSTEM_UPDATE);
    });
  }, 10000);

  const eventStream = async (notifier: BenchMarkEvents | SystemEvents) => {
    if (isConnectionClosed) {
      return;
    }
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
