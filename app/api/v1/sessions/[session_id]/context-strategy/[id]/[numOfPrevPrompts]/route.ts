import { NextRequest } from 'next/server';
import config from '@/moonshot.config';
export const dynamic = 'force-dynamic';

const isValidId = (id: string) => {
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  return idRegex.test(id);
};

export async function PUT(request: NextRequest) {
  let session_id: string;
  let strategy_id: string;
  let numOfPrevPrompts: string;
  try {
    const segments = request.nextUrl.pathname.split('/');
    session_id = segments[4];
    strategy_id = segments[6];
    numOfPrevPrompts = segments[7];
    if (!isValidId(session_id)) {
      throw new Error("Invalid session id")
    }
    if (!isValidId(strategy_id)) {
      throw new Error("Invalid strategy id")
    }
    if (!isValidId(numOfPrevPrompts)) {
      throw new Error("Invalid num of prev prompts")
    }
  } catch (error) {
    return new Response(
      'Unable to get session id, context strategy id, or numOfPrevPrompts',
      {
        status: 500,
      }
    );
  }

  if (!session_id || !strategy_id || !numOfPrevPrompts) {
    return new Response(
      'Unable to get session id, context strategy id, or numOfPrevPrompts',
      {
        status: 500,
      }
    );
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/context-strategy/${strategy_id}/${numOfPrevPrompts}`,
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
  let strategy_id: string;
  let numOfPrevPrompts: string;
  try {
    const segments = request.nextUrl.pathname.split('/');
    session_id = segments[4];
    strategy_id = segments[6];
    numOfPrevPrompts = segments[7];
    if (!isValidId(session_id)) {
      throw new Error("Invalid session id")
    }
    if (!isValidId(strategy_id)) {
      throw new Error("Invalid strategy id")
    }
    if (!isValidId(numOfPrevPrompts)) {
      throw new Error("Invalid num of prev prompts")
    }
  } catch (error) {
    return new Response(
      'Unable to get session id or context strategy id or numOfPrevPrompts',
      {
        status: 500,
      }
    );
  }

  if (!session_id || !strategy_id || !numOfPrevPrompts) {
    return new Response(
      'Unable to get session id or context strategy id or numOfPrevPrompts',
      {
        status: 500,
      }
    );
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/context-strategy/${strategy_id}/${numOfPrevPrompts}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response;
}
