import EventEmitter from 'events';

export const appEventBus = new EventEmitter();
appEventBus.setMaxListeners(5);
console.log('BM EventBus limits: ', appEventBus.getMaxListeners());
