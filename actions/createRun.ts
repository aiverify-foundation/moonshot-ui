'use server';
import { ZodError, z } from 'zod';
import { BenchmarkCollectionType } from '@/app/types/enums';
import config from '@/moonshot.config';
import { formatZodSchemaErrors } from './helpers/formatZodSchemaErrors';
import { redirect } from 'next/navigation';

const runSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  numOfPrompts: z.preprocess(
    (val) => Number(val),
    z.number().min(1, 'Number of prompts must be at least 1')
  ),
  inputs: z.array(z.string()).min(1, 'At least one cookbook is required'),
  endpoints: z.array(z.string()).min(1, 'At least one endpoint is required'),
});

export async function createRun(
  prevState: FormState<BenchmarkRunFormValues>,
  formData: FormData
) {
  let newRunData: z.infer<typeof runSchema>;

  try {
    newRunData = runSchema.parse({
      run_name: formData.get('name'),
      description: formData.get('description'),
      num_of_prompts: formData.get('numOfPrompts'),
      inputs: formData.getAll('inputs'),
      endpoints: formData.getAll('endpoints'),
    });
  } catch (error) {
    return formatZodSchemaErrors(error as ZodError);
  }

  newRunData.random_seed = formData.get('randomSeed');

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBenchmarks}?type=${BenchmarkCollectionType.COOKBOOK}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRunData),
    }
  );

  const responseBody = await response.json();
  const errors: string[] = [];
  if (responseBody.error) {
    errors.push(responseBody.error);
  } else if (responseBody.detail) {
    errors.push(responseBody.detail);
  }

  if (!response.ok || responseBody.success === false) {
    return {
      formStatus: 'error',
      formErrors: {
        error: (errors.length && errors) || ['An unknown error occurred'],
      },
    };
  }

  redirect(`/benchmarking/session/run?runner_id=${responseBody.data.id}`);
}
