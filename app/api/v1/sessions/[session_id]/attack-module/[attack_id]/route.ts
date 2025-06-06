import { NextRequest } from 'next/server';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

const isValidId = (id: string) => {
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  return idRegex.test(id);
};

export async function PUT(request: NextRequest) {
  let session_id: string;
  let attack_id: string;
  try {
    const segments = request.nextUrl.pathname.split('/');
    session_id = segments[4];
    attack_id = segments[6];
    if (!isValidId(session_id)) {
      throw new Error("Invalid session id")
    }
    if (!isValidId(attack_id)) {
      throw new Error("Invalid attack id")
    }
  } catch (error) {
    return new Response('Unable to get session id from url path', {
      status: 500,
    });
  }

  if (!session_id || !attack_id) {
    return new Response('Unable to get session id or attack id from', {
      status: 500,
    });
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/attack-module/${attack_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}

export async function DELETE(request: NextRequest) {
  let session_id: string;
  let attack_id: string;
  try {
    const segments = request.nextUrl.pathname.split('/');
    session_id = segments[4];
    attack_id = segments[6];
    if (!isValidId(session_id)) {
      throw new Error("Invalid session id")
    }
    if (!isValidId(attack_id)) {
      throw new Error("Invalid attack id")
    }
  } catch (error) {
    return new Response('Unable to get session id from url path', {
      status: 500,
    });
  }

  if (!session_id || !attack_id) {
    return new Response('Unable to get session id or attack id from', {
      status: 500,
    });
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/attack-module/${attack_id}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}
