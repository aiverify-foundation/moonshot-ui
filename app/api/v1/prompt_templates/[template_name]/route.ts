import { basePathPromptTemplates, hostURL } from '@/app/api/constants';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  let template_name: string;
  try {
    template_name = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get template name from url path', { status: 500 });
  }
  const response = await fetch(`${hostURL}${basePathPromptTemplates}/${template_name}`, {
    method: 'PUT',
  });
  return response;
}

export async function DELETE(request: NextRequest) {
  let template_name: string;
  try {
    template_name = request.nextUrl.pathname.split('/')[4];
  } catch (error) {
    return new Response('Unable to get template name from url path', { status: 500 });
  }
  const response = await fetch(`${hostURL}${basePathPromptTemplates}/${template_name}`, {
    method: 'DELETE',
  });
  return response;
}
