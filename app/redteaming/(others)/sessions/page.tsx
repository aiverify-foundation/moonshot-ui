import { ApiResult, processResponse } from '@/app/lib/http-requests';
import { RedteamSessionsViewList } from '@/app/views/redteaming/redteamSessionsViewList';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

async function fetchSessions() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}`,
    { cache: 'no-store' }
  );
  const result = await processResponse<Session[]>(response);
  return result;
}

export default async function SessionsPage() {
  const result = await fetchSessions();
  if ('error' in result) {
    throw result.error;
  }
  return (
    <RedteamSessionsViewList sessions={(result as ApiResult<Session[]>).data} />
  );
}
