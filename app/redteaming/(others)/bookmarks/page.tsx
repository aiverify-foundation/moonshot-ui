import { processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import Link from 'next/link';

async function fetchBookmarks() {
  const bookmarks = await fetch(`${config.webAPI.basePathBookmarks}`);
  const result = await processResponse<BookMark[]>(bookmarks);
  return result;
}

export default async function BookmarksPage() {
  return;
}
