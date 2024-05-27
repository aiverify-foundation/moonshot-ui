import EventEmitter from 'events';

const MAX_LISTENERS = 15;

export const appEventBus = new EventEmitter();
appEventBus.setMaxListeners(MAX_LISTENERS);
console.log('BM EventBus limits: ', appEventBus.getMaxListeners());
