import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

var past = null;
var is_valid = true;

const RootComponent = () => {
  const [webSocketData, setWebSocketData] = useState({});
  const [ws, setws] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8760");
    setws(ws);

    ws.addEventListener('open', function (event) {
      console.log("WebSocket connection opened.");
    });

    ws.addEventListener("message", e => {
      console.log("WebSocket message received:", e.data);
      try {
        const data = JSON.parse(e.data);

        if (isValidData(data)) {
          setWebSocketData(data);
          is_valid = true;
        } else {
          console.log("Empty or invalid data received, state not updated.");
          is_valid = false;
        }
      }
      catch{
        is_valid = false;
      }
      

    });
  }, []);


  function isValidData(data) {
    console.log("Checking data is valid");
    console.log(data);
    console.log('==========');
    return data && typeof data === 'object' && data !== null;
  }
  if (!is_valid){
    return past;
  }
  else{
    var current = 
      <React.StrictMode>
        <App inputdict={webSocketData} ws = {ws} />
      </React.StrictMode>
  past = current;
  return current;
  };
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootComponent />);