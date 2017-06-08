import EventSource from '../src/EventSource';

Object.defineProperty(window, 'EventSource', {
  writable: true,
  value: EventSource,
});
