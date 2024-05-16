import React from 'react';
import { isErrorWithMessage } from '@/app/lib/error-utils';
import { processResponse } from '@/app/lib/http-requests';
import { RedteamSessionChats } from '@/app/views/redteaming/redteamSessionChats';
import config from '@/moonshot.config';

async function fetchSessionData(id: string) {
  if (id == undefined) {
    return new Error('No id provided');
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${id}?include_history=true`
  );
  const result = await processResponse<SessionData>(response);
  return result;
}

export default async function BenchmarkNewSessionFlowPage(props: {
  params: { id: string };
}) {
  const result = await fetchSessionData(props.params.id);
  if (isErrorWithMessage(result)) {
    return <h1>Error</h1>;
  }
  return (
    <div className="flex items-center w-[100vw] h-[100vh] min-w-[1440px] min-h-[900px]">
      <RedteamSessionChats sessionData={result.data} />
    </div>
  );
}
