import { NextResponse } from 'next/server';
import { toErrorWithMessage } from '@/app/lib/error-utils';
import config from '@/moonshot.config';

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const response = await fetch(
      `${config.webAPI.hostURL}${config.webAPI.basePathBookmarks}`,
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch the JSON file');
    }

    const fileStream = await response.blob();
    const reader = fileStream.stream().getReader();
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            controller.enqueue(value);
            push();
          });
        }
        push();
      },
    });

    const res = new NextResponse(stream);
    res.headers.set(
      'Content-Disposition',
      'attachment; filename="bookmarks.json"'
    );
    res.headers.set('Content-Type', 'application/json');
    return res;
  } catch (error) {
    const errorMessage = toErrorWithMessage(error);
    return NextResponse.json(
      { message: errorMessage.message },
      { status: 500 }
    );
  }
}
