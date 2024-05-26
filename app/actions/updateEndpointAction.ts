'use server';

import config from '@/moonshot.config';

export async function updateEndpointAction(formData: FormData) {
  const data: LLMEndpointFormValues = {
    connector_type: formData.get('connector_type') as string,
    name: formData.get('name') as string,
    uri: formData.get('uri') as string,
    token: formData.get('token') as string,
    max_calls_per_second: formData.get('max_calls_per_second') as string,
    max_concurrency: formData.get('max_concurrency') as string,
    params: JSON.parse(formData.get('params') as string),
  };

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathLLMEndpoints}/${formData.get('id')}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  return response;
}
