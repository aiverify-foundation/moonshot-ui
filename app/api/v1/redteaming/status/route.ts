import { handleRedTeamUpdate } from '@/app/api/v1/redteaming/stream/util';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json()) as ArtStatus;
  console.debug('ART Webhook callback invoked', {
    current_runner_id: body.current_runner_id,
    current_status: body.current_status,
  });

  handleRedTeamUpdate(body);
  return new Response(
    JSON.stringify({ msg: 'Updates sent to ART SSE writer' })
  );
}
