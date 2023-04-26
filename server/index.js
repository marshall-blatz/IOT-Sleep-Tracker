const express = require("express");
const path = require('path');
const mqtt = require('mqtt');
const WebSocket = require('ws');


// MQTT broker URL and topic
const brokerUrl = 'mqtt://broker.mqttdashboard.com'; 
const topic = 'iowa-iot-project/alarm';

const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/public')));
app.use(express.json())

// Handle Toggle on alarms
app.post('/api/alarm/on/:id', (req, res) => {
    const alarmId = req.params.id;
    console.log("turning on:", alarmId)
    let subTopic = topic + "/on"
    client.publish(subTopic, JSON.stringify(req.body))
    return
});

// Handle Toggle off alarms
app.post('/api/alarm/off/:id', (req, res) => {
    const alarmId = req.params.id;
    console.log("turning off:", alarmId)
    let subTopic = topic + "/off"
    client.publish(subTopic, JSON.stringify(req.body))
    return
});

// Handle GET requests to the /api route
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// Set up a WebSocket server
const wss = new WebSocket.Server({ server });

// Set up an MQTT client and subscribe to the topic
const client = mqtt.connect(brokerUrl);
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('iowa-iot-project/sleep-data');
});

// Listen for incoming MQTT messages and send them to the WebSocket connections
client.on('message', (topic, message) => {
  const data = message.toString();
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});