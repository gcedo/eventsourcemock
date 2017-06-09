// @flow
import React from 'react';
import { mount } from 'enzyme';

import Component from './Component';
import { sources } from '../src/EventSource';

const messageEvent = new MessageEvent('foo', {
  data: '1',
});

describe('update counter on SSE', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(<Component />);
  });

  it('should initialise counter to 0', () => {
    expect(wrapper.state('counter')).toBe(0);
  });

  it('should display "0"', () => {
    expect(wrapper.text()).toBe('0');
  });

  it('should update the counter to 1', () => {
    sources['http://example.com/events'].emit(messageEvent.type, messageEvent);
    expect(wrapper.state('counter')).toBe(1);
  });

  it('close the EventSource on unmount', () => {
    wrapper.unmount();
    expect(sources['http://example.com/events'].readyState).toBe(2);
  });
});
