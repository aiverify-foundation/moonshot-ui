import { NextResponse } from 'next/server';
import { appEventBus } from '@/app/api/eventbus';
import { AppEventTypes } from '@/app/types/enums';
import { Writer, getSSEWriter } from './sse_writer';
import { RedTeamEvents, SystemEvents } from '@api/types';

/*
Both the POST and GET endpoints to send updates to the ART SSE writer are defined here in 1 file.
There was a weird issue in the past where these 2 endpoints were separate and defined in separate files - the eventBus (appEventBus) was not always the same instance.
*/

export async function POST(request: Request) {
  const body = (await request.json()) as ArtStatus;
  console.debug('ART Webhook callback invoked', {
    current_runner_id: body.current_runner_id,
    current_status: body.current_status,
  });

  appEventBus.emit(AppEventTypes.REDTEAM_UPDATE, body);
  return new Response(
    JSON.stringify({ msg: 'Updates sent to ART SSE writer' })
  );
}

let isConnectionClosed = false;
let heartbeatInterval: NodeJS.Timeout;

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const sseWriter: Writer | undefined = getSSEWriter(writer, encoder);

  function handleRedTeamUpdate(data: ArtStatus) {
    console.log('ART Data received from webhook', {
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

  appEventBus.on(AppEventTypes.REDTEAM_UPDATE, (data: ArtStatus) => {
    handleRedTeamUpdate(data);
  });

  // Heartbeat mechanism
  isConnectionClosed = true;
  clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    console.log('Sending ART SSE heartbeat');
    writer.write(encoder.encode(': \n\n')).catch(() => {
      isConnectionClosed = true;
      appEventBus.removeAllListeners(AppEventTypes.REDTEAM_UPDATE);
      clearInterval(heartbeatInterval);
      console.error(
        'Error writing heartbeat to SSE ART stream. This is expected if SSE connection was closed. Cleaning up SSE ART resources.'
      );
    });
  }, 10000);

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
