'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export const redirectRoute = (
  path: string,
  tagsToRevalidate: string[] = []
) => {
  const modifiedPath = `${process.env.NEXT_PUBLIC_BASE_PATH}${path}`;
  tagsToRevalidate.forEach((tag) => {
    revalidateTag(tag);
  });
  redirect(modifiedPath);
};
