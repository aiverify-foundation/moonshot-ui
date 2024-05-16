import { NextResponse } from 'next/server';
import { getSSEWriter } from './sse_writer';
import { appEventBus } from '@api/eventbus';
import { BenchMarkEvents, RedTeamEvents, SystemEvents } from '@api/types';
import { AppEventTypes } from '@apptypes/enums';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const sseWriter = getSSEWriter(writer, encoder);
  let isConnectionClosed = false;

  appEventBus.on(AppEventTypes.REDTEAM_UPDATE, (data: ArtStatus) => {
    console.log('ART Data received from webhook', {
      runner_id: data.current_runner_id,
      current_status: data.current_status,
    });
    try {
      if ('current_runner_id' in data) {
        (sseWriter as RedTeamEvents).update({
          data,
          event: AppEventTypes.REDTEAM_UPDATE,
        });
      }
    } catch (error) {
      console.error('Error writing to SSE ART stream', error);
    }
  });
  // Heartbeat mechanism
  const heartbeatInterval = setInterval(() => {
    console.log('Sending SSE RT heartbeat');
    writer.write(encoder.encode(': \n\n')).catch(() => {
      isConnectionClosed = true;
      appEventBus.removeAllListeners(AppEventTypes.REDTEAM_UPDATE);
      clearInterval(heartbeatInterval);
      console.error(
        'Error writing heartbeat to SSE ART stream. This is expected if SSE connection was closed. Cleaning up SSE ART resources.'
      );
    });
  }, 10000);

  const eventStream = async (notifier: BenchMarkEvents | SystemEvents) => {
    if (isConnectionClosed) {
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
