import { NextResponse } from 'next/server';
import { getSSEWriter } from './sse_writer';
import { appEventBus } from '@api/eventbus';
import { BenchMarkEvents, SystemEvents } from '@api/types';
import { AppEventTypes } from '@apptypes/enums';

export const dynamic = 'force-dynamic';

let heartbeatTimers: NodeJS.Timeout[] = [];

const cleanup = () => {
  heartbeatTimers.forEach((timer) => clearInterval(timer));
  heartbeatTimers = [];
  appEventBus.removeAllListeners(AppEventTypes.BENCHMARK_UPDATE);
  appEventBus.removeAllListeners(AppEventTypes.SYSTEM_UPDATE);
};

process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit();
});

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const sseWriter = getSSEWriter(writer, encoder);

  const totalListeners = appEventBus.listenerCount(
    AppEventTypes.BENCHMARK_UPDATE
  );
  if (totalListeners === appEventBus.getMaxListeners()) {
    console.log(
      'Max number of listeners reached for: ',
      AppEventTypes.BENCHMARK_UPDATE
    );
    return new NextResponse('Max number of listeners reached', { status: 429 });
  }

  const emitter = appEventBus.on(
    AppEventTypes.BENCHMARK_UPDATE,
    (data: TestStatus) => {
      console.debug('Data received from webhook', {
        runner_id: data.current_runner_id,
        current_progress: data.current_progress,
        current_status: data.current_status,
      });
      try {
        if ('current_runner_id' in data) {
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

  // Heartbeat mechanism
  const heartbeatInterval = setInterval(() => {
    console.log('sending BM SSE heartbeat');
    console.log(
      'listeners on appEventBus: ',
      appEventBus.listenerCount(AppEventTypes.BENCHMARK_UPDATE)
    );
    console.log('heartbeatTimers: ', heartbeatTimers.length);
    writer.write(encoder.encode(': \n\n')).catch(() => {
      emitter.removeAllListeners(AppEventTypes.BENCHMARK_UPDATE);
      clearInterval(heartbeatInterval);
      const index = heartbeatTimers.indexOf(heartbeatInterval);
      if (index > -1) {
        heartbeatTimers.splice(index, 1);
      }
      console.error(
        'Error writing heartbeat to SSE stream. This is expected if SSE connection was closed. Cleaning up SSE resources.'
      );
    });
  }, 10000);

  heartbeatTimers.push(heartbeatInterval);

  const eventStream = async (notifier: BenchMarkEvents | SystemEvents) => {
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
