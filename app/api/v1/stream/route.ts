import EventEmitter from 'events';
import { NextResponse } from 'next/server';
import { getSSEWriter } from './sse_writer';
import { appEventBus } from '@api/eventbus';
import { BenchMarkEvents, SystemEvents } from '@api/types';
import { AppEventTypes } from '@apptypes/enums';

export const dynamic = 'force-dynamic';

let heartbeatTimers: NodeJS.Timeout[] = [];
let bmEmitters: EventEmitter[] = [];

const cleanup = () => {
  heartbeatTimers.forEach((timer) => clearInterval(timer));
  heartbeatTimers = [];
  bmEmitters.forEach((emitter) => emitter.removeAllListeners());
  bmEmitters = [];
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
  if (totalListeners === appEventBus.getMaxListeners() - 1) {
    bmEmitters[0].removeAllListeners(AppEventTypes.BENCHMARK_UPDATE);
    bmEmitters.shift();
  }
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
      let errorCount = 0;
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
        console.error('Error writing webhook data to SSE stream', error);
        errorCount++; // Increment error count

        if (errorCount === 20) {
          emitter.removeAllListeners(AppEventTypes.BENCHMARK_UPDATE);
          errorCount = 0; // Reset error count after 10 occurrences
          const index = bmEmitters.indexOf(emitter);
          if (index > -1) {
            bmEmitters.splice(index, 1);
          }
        }
      }
    }
  );
  bmEmitters.push(emitter);

  // Heartbeat mechanism
  // const heartbeatInterval = setInterval(() => {
  //   console.log('sending BM SSE heartbeat');
  //   console.log(
  //     'listeners on appEventBus: ',
  //     appEventBus.listenerCount(AppEventTypes.BENCHMARK_UPDATE)
  //   );
  //   console.log('heartbeatTimers: ', heartbeatTimers.length);
  //   writer.write(encoder.encode(': \n\n')).catch(() => {
  //     console.error(
  //       'Error writing heartbeat to SSE stream. This is expected if SSE connection was closed. Cleaning up SSE resources.'
  //     );
  //     clearInterval(heartbeatInterval);
  //     const index = heartbeatTimers.indexOf(heartbeatInterval);
  //     if (index > -1) {
  //       heartbeatTimers.splice(index, 1);
  //     }
  //   });
  // }, 10000);

  // heartbeatTimers.push(heartbeatInterval);

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
