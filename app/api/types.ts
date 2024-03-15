import { AppEventTypes } from '@/app/types/enums';

export interface Message<T = string | Record<string, unknown>> {
  data: T;
  comment?: string;
  event?: string;
  id?: string;
  retry?: number;
}

export interface EventNotifier<
  T extends {
    update: T['update'] extends Message ? Message<T['update']>['data'] : never;
    complete: T['complete'] extends Message
      ? Message<T['complete']>['data']
      : never;
  } = any,
> {
  update: (message: Message<T['update']>['data']) => void;
  complete: (message: Message<T['complete']>['data']) => Promise<void>;
}

export type BenchMarkEvents = EventNotifier<{
  update: {
    data: TestStatus;
    event: AppEventTypes;
  };
  complete: {
    data: TestStatus;
    event: AppEventTypes;
  };
}>;

export type SystemEvents = EventNotifier<{
  update: {
    data: Record<string, string>;
    event: AppEventTypes.SYSTEM_UPDATE;
  };
  complete: {
    data: Record<string, string>;
    event: AppEventTypes.SYSTEM_UPDATE;
  };
}>;
