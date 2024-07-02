'use server';
import { revalidatePath } from 'next/cache';
import { ZodError, z } from 'zod';
import config from '@/moonshot.config';

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
    const zodError = error as ZodError;
    const errorMap = zodError.flatten().fieldErrors;
    return {
      formStatus: 'error',
      formErrors: errorMap
        ? Object.entries(errorMap).reduce(
            (acc, [key, value]) => {
              acc[key] = value || [];
              return acc;
            },
            {} as Record<string, string[]>
          )
        : undefined,
    };
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
  if (!response.ok) {
    return {
      formStatus: 'error',
      formErrors: { error: ['An unknown error occurred'] },
    };
  }
  revalidatePath('/benchmarking/cookbooks');
  return {
    formStatus: 'success',
    formErrors: undefined,
  };
};
