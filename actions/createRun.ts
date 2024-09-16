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
  let runAll = false;
  try {
    runAll = formData.get('run_all') === 'true';
  } catch (error) {
    return {
      formStatus: 'error',
      formErrors: {
        error: ['Failed to parse run_all'],
      },
    };
  }

  // Dynamically create the schema based on runAll
  const dynamicRunSchema = z.object({
    run_name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    num_of_prompts: z.preprocess(
      (val) => Number(val),
      runAll
        ? z.number()
        : z.number().min(1, 'Number of prompts must be at least 1')
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
    run_all: z.preprocess((val) => val === 'true', z.boolean()),
  });

  let newRunData: z.infer<typeof dynamicRunSchema>;

  try {
    newRunData = dynamicRunSchema.parse({
      run_name: formData.get('run_name'),
      description: formData.get('description'),
      num_of_prompts: formData.get('num_of_prompts'),
      inputs: formData.getAll('inputs'),
      endpoints: formData.getAll('endpoints'),
      random_seed: formData.get('random_seed'),
      runner_processing_module: formData.get('runner_processing_module'),
      system_prompt: formData.get('system_prompt'),
    });
  } catch (error) {
    return formatZodSchemaErrors(error as ZodError);
  }

  if (runAll) {
    newRunData.num_of_prompts = 0;
  }

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
    return {
      formStatus: 'error',
      formErrors: {
        error: ['Failed to parse error'],
      },
    };
  }

  redirect(`/benchmarking/session/run?runner_id=${responseBody.id}`);
}
