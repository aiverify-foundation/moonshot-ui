// SSE implementation follows 'ts-sse' closely
//https://github.com/michaelangeloio/ts-sse

import { EventNotifier, Message } from '../../types';

function toDataString(data: string | Record<string, unknown>): string {
  if (data) {
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data);
    }
    return toDataString(JSON.stringify(data));
  }

  //prefix "data:" is required to indicate a piece of data in message
  return data
    .split(/\r\n|\r|\n/)
    .map((line) => `data: ${line}\n\n`) //double new line - signifies end of of message and prompts browser to process the event
    .join('');
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
      void writer.write(encoder.encode(toDataString(message.data)));
    }
  }

  update(message: Message) {
    this.writeMessage(this.writer, this.encoder, message);
  }

  complete(message: Message) {
    this.writeMessage(this.writer, this.encoder, message);
    void this.writer.close();
  }
}

export const getSSEWriter = (
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder
) => new Writer(writer, encoder);
