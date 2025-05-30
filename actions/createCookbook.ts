'use server';
import { ZodError, z } from 'zod';
import config from '@/moonshot.config';
import { formatZodSchemaErrors } from './helpers/formatZodSchemaErrors';

const cookbookSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  description: z.string().optional(),
  recipes: z.array(z.string()).min(1, 'At least one recipe is required'),
});

export const createCookbook = async (
  prevState: FormState<CookbookFormValues>,
  formData: FormData
): Promise<FormState<CookbookFormValues>> => {
  let newCookbookData: z.infer<typeof cookbookSchema>;
  try {
    newCookbookData = cookbookSchema.parse({
      name: formData.get('name'),
      description: formData.get('description'),
      recipes: formData.getAll('recipes'),
    });
  } catch (error) {
    return formatZodSchemaErrors(error as ZodError);
  }
  if (newCookbookData.description?.trim() === '') {
    newCookbookData.description = undefined;
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathCookbooks}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCookbookData),
    }
  );
  const result = await response.json();
  let errors = [];
  if (result.message) {
    errors.push(result.message);
  } else if (result.detail) {
    errors.push(result.detail);
  }
  if (!response.ok) {
    return {
      formStatus: 'error',
      formErrors: {
        error: (errors.length && errors) || ['An unknown error occurred'],
      },
    };
  }
  return {
    formStatus: 'success',
    formErrors: undefined,
    ...newCookbookData,
  };
};
