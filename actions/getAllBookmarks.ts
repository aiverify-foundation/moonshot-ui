'use server';

import config from '@/moonshot.config';

export async function getAllBookmarks() {
  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBookmarks}`
  );

  const responseBody = await response.json();
  const errors: string[] = [];
  if (responseBody.message) {
    errors.push(responseBody.message);
  } else if (responseBody.detail) {
    errors.push(responseBody.detail);
  }

  if (!response.ok || responseBody.success === false) {
    return {
      status: 'error',
      error: (errors.length && errors) || ['An unknown error occurred'],
    };
  }

  return {
    status: 'success',
    data: responseBody,
  };
}
