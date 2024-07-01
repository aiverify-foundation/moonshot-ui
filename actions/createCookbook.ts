'use server';

import { z } from 'zod';

const cookbookSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  recipes: z.array(z.string()).min(1, 'At least one recipe is required'),
});

export const createCookbook = async (
  prevState: CookbookFormValues,
  formData: FormData
): Promise<ActionResponse<string>> => {
  const data = cookbookSchema.parse(Object.fromEntries(formData));
  console.log(data);
  return {
    statusCode: 200,
    data: 'Cookbook created',
  };
};
