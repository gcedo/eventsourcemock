// @flow
import EventEmitter from 'events';

type EventSourceConfigurationType = {
  withCredentials: boolean,
};

type ReadyStateType = 0 | 1 | 2;

const defaultOptions = {
  withCredentials: false,
};

export default class EventSource {
  __emitter: EventEmitter;
  onerror: ?EventHandler;
  onmessage: ?EventHandler;
  onopen: ?EventHandler;
  readyState: ReadyStateType;
  url: string;
  withCredentials: boolean;

  constructor(
    url: string,
    configuration?: EventSourceConfigurationType = defaultOptions,
  ) {
    this.url = url;
    this.withCredentials = configuration.withCredentials;
    this.__emitter = new EventEmitter();
  }

  addEventListener(eventName: string, listener: Function) {
    this.__emitter.addListener(eventName, listener);
  }

  close() {
    this.readyState = 2;
  }

  emit(eventName: string, messageEvent: MessageEvent) {
    this.__emitter.emit(eventName, messageEvent.data);
  }
}
