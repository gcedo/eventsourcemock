# `eventsourcemock` [![Build Status](https://travis-ci.org/gcedo/eventsourcemock.svg?branch=master)](https://travis-ci.org/gcedo/eventsourcemock)

A dependency free mock for EventSource objects.


## Example (with Jest)
### Setup
To setup the mock create a new file where the mock is assigned to the `window` object.

```js
// __test__/configJSDom.js
import EventSource from 'eventsourcemock';

Object.defineProperty(window, 'EventSource', {
  value: EventSource,
});
```
[Then instruct Jest to use that file during setup in `package.json`](https://facebook.github.io/jest/docs/configuration.html#setupfiles-array).
```json
"jest": {
  "setupFiles": [
    "./__test__/configJSDom.js"
  ]
}
```

### Usage
Suppose we want to test this component, which updates its state when a message is received from an `EventSource` instance.

```js
export default class Component extends React.Component {
  props: Props;
  state: State;
  source: $PropertyType<window, 'EventSource'>;

  constructor(props: Props) {
    super(props);
    this.state = {
      counter: 0,
    };
  }

  componentDidMount() {
    this.source = new window.EventSource('http://example.com/events');
    this.source.addEventListener('foo', messageEvent => {
      this.setState({ counter: parseInt(messageEvent.data, 10) });
    });
  }

  componentWillUnmount() {
    this.source.close();
  }

  render() {
    return <div className="Component">{this.state.counter}</div>;
  }
}
```

We can write a test file that grabs the source from the global `sources` object and simulates messages:

```js
// @flow
import React from 'react';
import { mount } from 'enzyme';

import Component from './Component';
import { sources } from 'eventsourcemock';

const messageEvent = new MessageEvent('foo', {
  data: '1',
});

describe('update counter on SSE', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(<Component />);
    sources['http://example.com/events'].emitOpen();
  });

  it('should initialise counter to 0', () => {
    expect(wrapper.state('counter')).toBe(0);
  });

  it('should display "0"', () => {
    expect(wrapper.text()).toBe('0');
  });

  it('should update the counter to 1', () => {
    sources['http://example.com/events'].emit(
      messageEvent.type,
      messageEvent
    );
    expect(wrapper.state('counter')).toBe(1);
  });

  it('should close the EventSource on unmount', () => {
    wrapper.unmount();
    expect(sources['http://example.com/events'].readyState).toBe(2);
  });
});

```

## API
### `sources: { [key: string]: EventSource }`
`sources` holds the `EventSource` instances created.

```js
import { sources } from 'eventsourcemock';
```

### `EventSource`
`EventSource` mocks `window.EventSource`, providing methods to simulate messages and errors from the network.
```js
import EventSource from 'eventsourcemock';
```
#### Constructor
```js
EventSource(
  url: string,
  options?: {
    withCredentials: boolean
  }
)
```

#### Properties
##### `__emitter`
A reference to the [node `EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) instance used internally.

##### `onopen`
See [eventSource.onopen](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/onopen).

##### `onmessage`
See [eventSource.onmessage](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/onmessage).

##### `onerror`
See [eventSource.onerror](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/onerror).

##### `readyState`
See [eventSource.readyState](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/readyState).

##### `url`
See [eventSource.url](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/url).

##### `withCredentials`
See [eventSource.withCredentials](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/withCredentials).


#### Methods
##### `emit(eventName: string, messageEvent?: MessageEvent)`
Calls each of the listeners registered for the event named `eventName`, providing `messageEvent` as argument.

*Example*
```js
const messageEvent = new MessageEvent('type', {
  data: 'message event data'
});
source.emit(messageEvent.type, messageEvent);
```

#### `emitOpen()`
Simulates the opening of a connection. It sets the ready state to open and invokes the callback.

##### `emitMessage(message: any)`
Simulates dispatching of a message, it invokes the `onmessage` callback.

#### `emitError(error: Error)`
Simulates dispatching an error event on the `EventSource` instance. Causes `onerror` to be called.

*Example (jest)*
```js
const onErrorSpy = jest.fn();
const error = new Error('Something went wrong.');
eventSource.onerror = onErrorSpy;
eventSource.emitError(error);
expect(onErrorSpy).toHaveBeenCalledWith(error);
```

##### `addEventListener(eventName: string, listener: Function)`
See [EventTarget.addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

##### `removeEventListener(eventName: string, listener: Function)`
See [EventTarget.removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

##### `close()`
See [EventSource.close](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/close).
