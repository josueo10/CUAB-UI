const WebSocket = require('ws');
const os = require('os');

// Testing File for sending a single message

const wss = new WebSocket.Server({ host: "localhost", port: 8760 });


var data = '{"boat": {"x":0,"y":1.5,"theta":4.12,"v":3,"w":2},"obstacles":[{"x":0.3,"y":0.5,"z":0,"classname":"green-buoy"},{"x": 0.2,"y":0.7,"z":0,"classname":"red-buoy"}],"waypoints":[{"x":0.1,"y":0.1},{"x":0.2,"y":0.3}],"temperature":35,"leak":false,"task":"Navigation","alive":true,"autonomous":true,"sL":5,"sR":2}';


console.log('Starting');

wss.on('connection', (ws) => {
  console.log('Client connected');

  console.log(data);
  ws.send(data);

  ws.addEventListener("message", e => {

    console.log("WebSocket message received:", e.data);
  });


  ws.on('close', () => {
    console.log('Client disconnected');
  });
});



