const express = require("express");
const path = require('path');
const mqtt = require('mqtt');

// MQTT broker URL and topic
const brokerUrl = 'mqtt://broker.mqttdashboard.com'; 
const topic = 'iowa-iot-project/alarm';

// MQTT client
const client = mqtt.connect(brokerUrl);

const PORT = process.env.PORT || 3001;
const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/public')));
app.use(express.json())

// Handle Toggle on alarms
app.get('/api/alarm/on/:id', (req, res) => {
    const alarmId = req.params.id;
    console.log("turning on:", alarmId)
    let subTopic = topic + "/on"
    client.publish(subTopic, "put alarm info here")
    return
});

// Handle Toggle off alarms
app.get('/api/alarm/off/:id', (req, res) => {
    const alarmId = req.params.id;
    console.log("turning off:", alarmId)
    let subTopic = topic + "/off"
    client.publish(subTopic, "put alarm info here")
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

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

// Disconnect from the MQTT broker when done
// setTimeout(() => {
//     client.end();
// }, 60000); // The timeout (in milliseconds) will adjust the duration of publishing (only runs for a minute right now)