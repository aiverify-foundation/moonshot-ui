import { NextRequest } from 'next/server';
import config from '@/moonshot.config';

const isValidId = (id: string) => {
  const idRegex = /^[a-zA-Z0-9_-]+$/;
  return idRegex.test(id);
};

export async function PUT(request: NextRequest) {
  let template_name: string;
  let session_id: string;
  let pathParts: string[];
  try {
    pathParts = request.nextUrl.pathname.split('/');
    session_id = pathParts[4];
    template_name = pathParts[6];
    if (!isValidId(session_id)) {
      throw new Error("Invalid session id")
    }
    if (!isValidId(template_name)) {
      throw new Error("Invalid template name")
    }
  } catch (error) {
    return new Response(
      'Unable to get template or session id name from url path',
      {
        status: 500,
      }
    );
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/prompt-template/${template_name}`,
    {
      method: 'PUT',
    }
  );
  return response;
}

export async function DELETE(request: NextRequest) {
  let template_name: string;
  let session_id: string;
  let pathParts: string[];
  try {
    pathParts = request.nextUrl.pathname.split('/');
    session_id = pathParts[4];
    template_name = pathParts[6];
    if (!isValidId(session_id)) {
      throw new Error("Invalid session id")
    }
    if (!isValidId(template_name)) {
      throw new Error("Invalid template name")
    }
  } catch (error) {
    return new Response(
      'Unable to get template name or session id from url path',
      {
        status: 500,
      }
    );
  }
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathSessions}/${session_id}/prompt-template/${template_name}`,
    {
      method: 'DELETE',
    }
  );
  return response;
}
