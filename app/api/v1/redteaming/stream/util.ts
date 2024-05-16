import { AppEventTypes } from '@/app/types/enums';
import { getSSEWriter } from './sse_writer';

export const stream = new TransformStream();
export const writer = stream.writable.getWriter();
export const encoder = new TextEncoder();
export const sseWriter = getSSEWriter(writer, encoder);

export function handleRedTeamUpdate(data: ArtStatus) {
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
