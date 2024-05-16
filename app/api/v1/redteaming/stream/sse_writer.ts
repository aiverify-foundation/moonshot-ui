// SSE implementation follows 'ts-sse' closely
//https://github.com/michaelangeloio/ts-sse

import { EventNotifier, Message } from '@api/types';

function toDataString(data: string | Record<string, unknown>): string {
  let stringData: string;
  if (typeof data === 'object' && data !== null) {
    stringData = JSON.stringify(data);
  } else {
    stringData = data.toString();
  }

  // Prefix "data:" is required to indicate a piece of data in the message
  // Double new line - signifies the end of a message and prompts the browser to process the event
  // This is brittle. Browser won't process the message if format is broken
  return (
    stringData
      .split(/\r\n|\r|\n/)
      .map((line) => `data: ${line}\n`)
      .join('\n') + '\n\n'
  );
}

export class Writer implements EventNotifier {
  constructor(
    readonly writer: WritableStreamDefaultWriter,
    readonly encoder: TextEncoder
  ) {}

  writeMessage(
    writer: WritableStreamDefaultWriter,
    encoder: TextEncoder,
    message: Message
  ): void {
    if (message.comment) {
      void writer.write(encoder.encode(`: ${message.comment}\n`));
    }
    if (message.event) {
      void writer.write(encoder.encode(`event: ${message.event}\n`));
    }
    if (message.id) {
      void writer.write(encoder.encode(`id: ${message.id}\n`));
    }
    if (message.retry) {
      void writer.write(encoder.encode(`retry: ${message.retry}\n`));
    }
    if (message.data) {
      const dataString = toDataString(message.data);
      void writer.write(encoder.encode(dataString));
    }
  }

  update(message: Message) {
    this.writeMessage(this.writer, this.encoder, message);
  }

  complete(message: Message) {
    const dataString = toDataString(message.data);
    this.writer
      .write(this.encoder.encode(dataString))
      .then(() => {
        return this.writer.close();
      })
      .catch((error) => {
        return Promise.reject(error);
      });
    return Promise.resolve();
  }
}

export const getSSEWriter = (
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder
) => new Writer(writer, encoder);
