import EventEmitter from 'events';
import { AppEventTypes } from '../types/enums';

export const appEventEmitter = new EventEmitter();
console.log('\x1b[36m%s\x1b[0m', 'Instantiate event emitter...done');

export function subscribeToBenchmarkEvent(
  callback: (data: Record<string, string | number>) => void
) {
  appEventEmitter.on(AppEventTypes.BENCHMARK_UPDATE, callback);
}

export function triggerEvent(
  event: AppEventTypes,
  data: Record<string, string | number>
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
