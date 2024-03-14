import EventEmitter from 'events';
import { AppEventTypes } from '@/app/types/enums';

export const appEventEmitter = new EventEmitter();
console.log('\x1b[36m%s\x1b[0m', 'Instantiate event emitter...done');

export function subscribeToBenchmarkEvent<T = Record<string, string | number>>(
  callback: (data: T) => void
) {
  appEventEmitter.on(AppEventTypes.BENCHMARK_UPDATE, callback);
}

export function triggerEvent<T = Record<string, string | number>>(
  event: AppEventTypes,
  data: T
) {
  appEventEmitter.emit(event, data);
}

export function removeAllBenchmarkListeners() {
  appEventEmitter.removeAllListeners(AppEventTypes.BENCHMARK_UPDATE);
}

export function removeAllSystemListeners() {
  appEventEmitter.removeAllListeners(AppEventTypes.SYSTEM_UPDATE);
}

export function listAllListeners() {
  const events = appEventEmitter.eventNames();
  events.forEach((event) => {
    console.log(`Listeners for ${String(event)}:`);
    const eventListeners = appEventEmitter.listeners(event);
    eventListeners.forEach((listener, index) => {
      console.log(`Listener ${index + 1}: ${listener.toString()}`);
    });
  });
}
