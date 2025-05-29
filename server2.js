const WebSocket = require('ws');
const os = require('os');
const fs = require('fs');

//Testing file for data from "result.txt" if all messages end with '"sR": 0.0}'

const wss = new WebSocket.Server({ host: "localhost", port: 8760 });

var newList = [];

fs.readFile('result.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let newText = data;
  while (true) {
    let opening = newText.indexOf('{');
    if (opening === -1) {
      break;
    }
    let closing = newText.indexOf('\"sR\": 0.0}');
    newList.push(newText.substring(opening, closing + 10));
    newText = newText.substring(closing + 10);
  }
  console.log(newList);
});

console.log('Starting');

wss.on('connection', (ws) => {
  console.log('Client connected');

  index = 0
  const loop = setInterval(() => {
    if (index === newList.length - 1) {
      clearInterval(loop)
    }
    ws.send(newList[index])
    console.log(newList[index++])

  }, 10)


  ws.addEventListener("message", e => {

    console.log("WebSocket message received:", e.data);
  });


  ws.on('close', () => {
    console.log('Client disconnected');
  });
});




