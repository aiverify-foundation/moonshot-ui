import { AppEventTypes } from '@apptypes/enums';
import { NextResponse } from 'next/server';
import { getSSEWriter } from './sse_writer';
import { appEventBus } from '@api/eventbus';
import { BenchMarkEvents, SystemEvents } from '@api/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const sseWriter = getSSEWriter(writer, encoder);
  let isConnectionClosed = false;

  appEventBus.on(AppEventTypes.BENCHMARK_UPDATE, (data: TestStatus) => {
    console.log('Data received from webhook', {
      exec_id: data.exec_id,
      exec_name: data.exec_name,
    });
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
  });
  // Heartbeat mechanism
  const heartbeatInterval = setInterval(() => {
    console.log('Sending SSE heartbeat');
    writer.write(encoder.encode(': \n\n')).catch(() => {
      isConnectionClosed = true;
      appEventBus.removeAllListeners(AppEventTypes.BENCHMARK_UPDATE);
      appEventBus.removeAllListeners(AppEventTypes.SYSTEM_UPDATE);
      clearInterval(heartbeatInterval);
      console.error(
        'Error writing heartbeat to SSE stream. This is expected if SSE connection was closed. Cleaning up SSE resources. Subsequent ResponseError (if any) can be ignored.'
      );
      (sseWriter as SystemEvents)
        .complete({
          data: { msg: 'SSE Closed' },
          event: AppEventTypes.SYSTEM_UPDATE,
        })
        .catch((error) => {
          console.error(
            'Error completing stream. Cleaning up SSE resources.  Subsequent ResponseError (if any) can be ignored.',
            error
          );
        });
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
