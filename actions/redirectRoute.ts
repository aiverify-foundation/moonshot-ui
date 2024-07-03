'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export const redirectRoute = (
  path: string,
  tagsToRevalidate: string[] = []
) => {
  tagsToRevalidate.forEach((tag) => {
    revalidateTag(tag);
  });
  redirect(path);
};
