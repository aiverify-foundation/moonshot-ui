'use server';
import { redirect } from 'next/navigation';
import { ZodError, z } from 'zod';
import { parseFastAPIError } from '@/actions/helpers/parseFastAPIError';
import { BenchmarkCollectionType } from '@/app/types/enums';
import config from '@/moonshot.config';
import { formatZodSchemaErrors } from './helpers/formatZodSchemaErrors';

export async function createRun(
  _: FormState<BenchmarkRunFormValues>,
  formData: FormData
) {
  const benchmarkRunSchema = z.object({
    run_name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    prompt_selection_percentage: z.preprocess(
      (val) => Number(val),
      z
        .number()
        .min(0, 'Prompt selection percentage must be at least 0')
        .max(100, 'Prompt selection percentage must be at most 100')
    ),
    inputs: z.array(z.string()).min(1, 'At least one cookbook is required'),
    endpoints: z.array(z.string()).min(1, 'At least one endpoint is required'),
    random_seed: z.preprocess(
      (val) => Number(val),
      z.number().min(0, 'Random seed must be at least 0')
    ),
    runner_processing_module: z
      .string()
      .min(1, 'Runner processing module is required'),
    system_prompt: z.string(),
  });

  const result = benchmarkRunSchema.safeParse({
    run_name: formData.get('run_name'),
    description: formData.get('description'),
    prompt_selection_percentage: formData.get('prompt_selection_percentage'),
    inputs: formData.getAll('inputs'),
    endpoints: formData.getAll('endpoints'),
    random_seed: formData.get('random_seed'),
    runner_processing_module: formData.get('runner_processing_module'),
    system_prompt: formData.get('system_prompt'),
  });

  if (!result.success) {
    return formatZodSchemaErrors(result.error as ZodError);
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}?type=${BenchmarkCollectionType.COOKBOOK}`,
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

  redirect(`/benchmarking/session/run?runner_id=${responseBody.id}`);
}
