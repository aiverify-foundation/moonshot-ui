export enum AppEventTypes {
  SYSTEM_UPDATE = 'system-update',
  BENCHMARK_UPDATE = 'benchmark-update',
  BENCHMARK_COMPLETE = 'benchmark-complete',
  REDTEAM_UPDATE = 'redteam-update',
}

export enum BenchmarkCollectionType {
  COOKBOOK = 'cookbook',
  BENCHMARK = 'benchmark',
}

export enum TestStatusProgress {
  COMPLETED = 'completed',
  RUNNING = 'running',
  ERRORS = 'completed_with_errors',
  CANCELLED = 'cancelled',
}

export enum RedteamStatusProgress {
  COMPLETED = 'completed',
  RUNNING = 'running',
  ERRORS = 'completed_with_errors',
  CANCELLED = 'cancelled',
}
