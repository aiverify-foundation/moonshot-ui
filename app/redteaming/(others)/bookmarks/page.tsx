import { isErrorWithMessage } from '@/app/lib/error-utils';
import { ApiResult, processResponse } from '@/app/lib/http-requests';
import config from '@/moonshot.config';
import { BookmarksViewList } from './bookmarksViewList';

async function fetchBookmarks() {
  const bookmarks = await fetch(
    `${config.webAPI.hostURL}${config.webAPI.basePathBookmarks}`,
    {
      cache: 'no-store',
    }
  );
  const result = await processResponse<BookMark[]>(bookmarks);
  return result;
}

export default async function BookmarksPage() {
  const result = await fetchBookmarks();
  if (isErrorWithMessage(result)) {
    throw result.message;
  }
  return (
    <BookmarksViewList bookmarks={(result as ApiResult<BookMark[]>).data} />
  );
}
