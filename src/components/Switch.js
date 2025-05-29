import React, { useState } from 'react';

const style = {
  Container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    cursor: 'pointer',
    backgroundColor: '#ddd',
  },
  Button: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    textTransform: 'uppercase',
    transition: 'background-color 0.3s ease',
  }
};


//Note: This Switch component has been replaced with the built in Switch component in App.js

const Switch = ({ ws, message = "Test Message" }) => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn(prevState => !prevState);
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log(ws)
      ws.send(message);
      console.log("Message sent:", message);
    } else {
      console.error("WebSocket is not open.");
    }
  };

  return (
    <div style={style.Container} onClick={toggleSwitch} aria-pressed={isOn}>
      <div
        style={{
          ...style.Button,
          backgroundColor: isOn ? '#4CAF50' : '#f44336',
        }}
      >
        {isOn ? 'On' : 'Off'}
      </div>
    </div>
  );
};

export default Switch;
