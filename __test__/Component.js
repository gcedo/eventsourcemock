// @flow
import React from "react";

type Props = {};
type State = {
  counter: number
};

export default class Component extends React.Component<> {
  props: Props;
  state: State;
  source: $PropertyType<window, "EventSource">;

  constructor(props: Props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  componentDidMount() {
    this.source = new window.EventSource("http://example.com/events");
    this.source.addEventListener("foo", messageEvent => {
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
