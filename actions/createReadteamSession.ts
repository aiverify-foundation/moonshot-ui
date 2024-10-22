'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { formatZodSchemaErrors } from '@/actions/helpers/formatZodSchemaErrors';
import { parseFastAPIError } from '@/actions/helpers/parseFastAPIError';
import config from '@/moonshot.config';

const redTeamNewSessionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  endpoints: z.array(z.string()).min(1, 'At least one endpoint is required'),
  attack_module: z.string().optional(),
});

export async function createReadteamSession(
  _: FormState<RedteamRunFormValues>,
  formData: FormData
) {
  const formValues = Object.fromEntries(formData);
  const result = redTeamNewSessionSchema.safeParse(formValues);
  if (!result.success) {
    return formatZodSchemaErrors(result.error);
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result.data),
    }
  );

  const responseBody = await response.json();
  if (responseBody.error) {
    const parsedErrors = parseFastAPIError(responseBody.error);
    if (Object.keys(parsedErrors).length > 0) {
      return {
        formStatus: 'error',
        formErrors: parsedErrors,
      };
    }
    try {
      return {
        formStatus: 'error',
        formErrors: {
          error: [JSON.stringify(responseBody.error)],
        },
      };
    } catch {
      return {
        formStatus: 'error',
        formErrors: {
          error: ['Failed to parse error'],
        },
      };
    }
  }

  if (!response.ok || responseBody.success === false) {
    if (responseBody.detail && typeof responseBody.detail === 'string') {
      return {
        formStatus: 'error',
        formErrors: {
          error: [responseBody.detail],
        },
      };
    }
    return {
      formStatus: 'error',
      formErrors: {
        error: ['Failed to parse error'],
      },
    };
  }

  const data: SessionData = responseBody.data;

  redirect(`/redteaming/sessions/${data.session.session_id}`);
}
