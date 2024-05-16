import { NextResponse } from 'next/server';
import { encoder, sseWriter, stream, writer } from './util';
import { RedTeamEvents, SystemEvents } from '@api/types';
import { AppEventTypes } from '@apptypes/enums';
export const dynamic = 'force-dynamic';

let isConnectionClosed = false;
let heartbeatInterval: NodeJS.Timeout;

export async function GET() {
  // Heartbeat mechanism
  isConnectionClosed = true;
  clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(() => {
    console.log('Sending ART SSE heartbeat');
    writer.write(encoder.encode(': \n\n')).catch(() => {
      isConnectionClosed = true;
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
