'use server';
import { ZodError, z } from 'zod';
import config from '@/moonshot.config';
import { formatZodSchemaErrors } from './helpers/formatZodSchemaErrors';

const bookmarkSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
  prompt: z.string().min(1, 'Prompt cannot be empty'),
  prepared_prompt: z.string().min(1, 'Prepared prompt cannot be empty'),
  response: z.string().min(1, 'Response cannot be empty'),
  metric: z.string().optional(),
  attack_module: z.string().optional(),
  context_strategy: z.string().optional(),
  prompt_template: z.string().optional(),
});

export async function createBookmark(
  prevState: FormState<BookmarkFormValues>,
  formData: FormData
) {
  let newBookmarkData: z.infer<typeof bookmarkSchema>;

  try {
    newBookmarkData = bookmarkSchema.parse({
      name: formData.get('name'),
      prompt: formData.get('prompt'),
      prepared_prompt: formData.get('prepared_prompt'),
      response: formData.get('response'),
      metric: formData.get('metric'),
      attack_module: formData.get('attack_module'),
      context_strategy: formData.get('context_strategy'),
      prompt_template: formData.get('prompt_template'),
    });
  } catch (error) {
    return formatZodSchemaErrors(error as ZodError);
  }
  if (newBookmarkData.metric?.trim() === '') {
    newBookmarkData.metric = undefined;
  }
  if (newBookmarkData.attack_module?.trim() === '') {
    newBookmarkData.attack_module = undefined;
  }
  if (newBookmarkData.context_strategy?.trim() === '') {
    newBookmarkData.context_strategy = undefined;
  }

  const response = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBookmarks}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBookmarkData),
    }
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
      formStatus: 'error',
      formErrors: {
        error: (errors.length && errors) || ['An unknown error occurred'],
      },
    };
  }

  return {
    formStatus: 'success',
    formErrors: undefined,
    ...newBookmarkData,
  };
}
