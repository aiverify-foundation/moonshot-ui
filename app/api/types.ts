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
  } = any, // eslint-disable-line
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

export type RedTeamEvents = EventNotifier<{
  update: {
    data: ArtStatus;
    event: AppEventTypes;
  };
  complete: {
    data: ArtStatus;
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

export type RunnerWebApiModel = {
  id: string;
  name: string;
  description: string;
  endpoits: string;
  database_file: string;
};

export type RunnerDetailWebApiModel = {
  run_id: number;
  runner_id: string;
  runner_args: {
    cookbooks: string[];
    num_of_prompts: number;
    random_seed: number;
    system_prompt: string;
    runner_processing_module: string;
    result_processing_module: string;
  };
  endpoints: string[];
  start_time: number;
};
