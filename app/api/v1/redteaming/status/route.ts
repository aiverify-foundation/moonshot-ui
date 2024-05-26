import EventEmitter from 'events';
import { NextResponse } from 'next/server';
import { appEventBus } from '@/app/api/eventbus';
import { toErrorWithMessage } from '@/app/lib/error-utils';
import { AppEventTypes } from '@/app/types/enums';
import { Writer, getSSEWriter } from './sse_writer';
import { RedTeamEvents, SystemEvents } from '@api/types';
export const dynamic = 'force-dynamic';

/*
artEventBus is instantiated twice instead of sharing the same intsance in dev mode!
only test this using prod build (npm run build && npm start)
*/

const artEventBus = new EventEmitter();
artEventBus.setMaxListeners(5);
console.log('ART EventBus limits: ', appEventBus.getMaxListeners());

export async function POST(request: Request) {
  const body = (await request.json()) as ArtStatus;
  console.debug('ART Webhook callback invoked', {
    current_runner_id: body.current_runner_id,
    current_status: body.current_status,
  });

  artEventBus.emit(AppEventTypes.REDTEAM_UPDATE, body);
  return new Response(
    JSON.stringify({ msg: 'Updates sent to ART SSE writer' })
  );
}

let isConnectionClosed = false;
let heartbeatTimers: NodeJS.Timeout[] = [];
const cleanup = () => {
  heartbeatTimers.forEach((timer) => clearInterval(timer));
  heartbeatTimers = [];
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
  const sseWriter: Writer | undefined = getSSEWriter(writer, encoder);

  function handleRedTeamUpdate(data: ArtStatus) {
    console.debug('ART Data received from webhook', {
      runner_id: data.current_runner_id,
      current_status: data.current_status,
    });
    if (!sseWriter) {
      console.error('SSE writer not initialized');
      return;
    }
    try {
      if ('current_runner_id' in data) {
        sseWriter.update({
          data,
          event: AppEventTypes.REDTEAM_UPDATE,
        });
      }
    } catch (error) {
      console.error('Error handling REDTEAM_UPDATE event', error);
    }
  }

  const totalListeners = appEventBus.listenerCount(
    AppEventTypes.REDTEAM_UPDATE
  );
  if (totalListeners === appEventBus.getMaxListeners()) {
    console.log(
      'Max number of listeners reached for: ',
      AppEventTypes.REDTEAM_UPDATE
    );
    return new NextResponse('Max number of listeners reached', { status: 429 });
  }

  const emitter = artEventBus.on(
    AppEventTypes.REDTEAM_UPDATE,
    (data: ArtStatus) => {
      handleRedTeamUpdate(data);
    }
  );

  // Heartbeat mechanism
  isConnectionClosed = true;
  const heartbeatInterval = setInterval(() => {
    try {
      console.log('Sending ART SSE heartbeat');
      console.log(
        'Number of listeners on appEventBus: ',
        artEventBus.listenerCount(AppEventTypes.REDTEAM_UPDATE)
      );
      writer.write(encoder.encode(': \n\n')).catch((error) => {
        if (error.name === 'AbortError') {
          console.error(
            'AbortError detected in heartbeat. This is expected if SSE connection was closed. Cleaning up SSE ART resources.'
          );
        }
        isConnectionClosed = true;
        emitter.removeAllListeners(AppEventTypes.REDTEAM_UPDATE);
        clearInterval(heartbeatInterval);
        const index = heartbeatTimers.indexOf(heartbeatInterval);
        if (index > -1) {
          heartbeatTimers.splice(index, 1);
        }
        console.error(
          'Error writing heartbeat to SSE ART stream. This is expected if SSE connection was closed. Cleaning up SSE ART resources.'
        );
      });
    } catch (error) {
      const errWIthMsg = toErrorWithMessage(error);
      console.error('Error sending ART SSE heartbeat', errWIthMsg);
    }
  }, 10000);

  heartbeatTimers.push(heartbeatInterval);

  const eventStream = async (notifier: RedTeamEvents | SystemEvents) => {
    if (!isConnectionClosed) {
      return;
    }
    (notifier as SystemEvents).update({
      data: { msg: 'SSE RT init done' },
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
