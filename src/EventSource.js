// @flow
import EventEmitter from "events";

type EventSourceConfigurationType = {
  withCredentials: boolean
};

type ReadyStateType = 0 | 1 | 2;

const defaultOptions = {
  withCredentials: false
};

export const sources: { [key: string]: EventSource } = {};

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
    configuration?: EventSourceConfigurationType = defaultOptions
  ) {
    this.url = url;
    this.withCredentials = configuration.withCredentials;
    this.readyState = 0;
    this.__emitter = new EventEmitter();
    sources[url] = this;
  }

  addEventListener(eventName: string, listener: Function) {
    this.__emitter.addListener(eventName, listener);
  }

  removeEventListener(eventName: string, listener: Function) {
    this.__emitter.removeListener(eventName, listener);
  }

  close() {
    this.readyState = 2;
  }

  emit(eventName: string, messageEvent?: MessageEvent) {
    this.__emitter.emit(eventName, messageEvent);
  }

  emitError(error: any) {
    if (typeof this.onerror === "function") {
      this.onerror(error);
    }
  }

  emitOpen() {
    this.readyState = 1;
    if (typeof this.onopen === "function") {
      this.onopen();
    }
  }

  emitMessage(message: any) {
    if (typeof this.onmessage === "function") {
      this.onmessage(message);
    }
  }
}
