import React from 'react';
import { isErrorWithMessage } from '@/app/lib/error-utils';
import { processResponse } from '@/app/lib/http-requests';
import { RedteamSessionChats } from '@/app/views/redteaming/redteamSessionChats';
import config from '@/moonshot.config';
/*
IMPORTANT - this page must be dynamically rendered.
fetchSessionData must be called every time so thatweb-api `active_runner` gets populated
*/
export const dynamic = 'force-dynamic';

async function fetchSessionData(id: string) {
  if (id == undefined) {
    return new Error('No id provided');
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${id}?include_history=true`,
    { cache: 'no-store' }
  );
  const result = await processResponse<SessionData>(response);
  return result;
}

export default async function BenchmarkNewSessionFlowPage(props: {
  params: { id: string };
}) {
  const result = await fetchSessionData(props.params.id);
  if (isErrorWithMessage(result)) {
    throw result.message;
  }
  return <RedteamSessionChats sessionData={result.data} />;
}
