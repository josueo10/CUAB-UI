import React, { Component } from 'react';
import WebSocket from 'websocket';

class WebSocketComponent extends Component {
  constructor() {
    super();
    this.state = {
      message: '',
    };
  }
  componentDidMount() {
    const socket = new WebSocket('ws://localhost:8767');
    socket.onopen = () => {
      console.log('WebSocket connected');
    };
    socket.onmessage = (event) => {
      this.setState({ message: event.data });
    };
    socket.onclose = () => {
      console.log('WebSocket closed');
    };
    this.socket = socket;
  }
  componentWillUnmount() {
    this.socket.close();
  }
  render() {
    return (
      <div>
        <p>WebSocket Message: {this.state.message}</p>
      </div>
    );
  }
}
export default WebSocketComponent;