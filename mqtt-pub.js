const mqtt = require('mqtt');

// MQTT broker URL and topic
const brokerUrl = 'mqtt://broker.mqttdashboard.com'; 
const topic = 'iowa-iot-project/sleep-data';

// MQTT client
const client = mqtt.connect(brokerUrl);

// Function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Publish a random number to the MQTT topic every 5 seconds
setInterval(() => {
  const randomNumber = getRandomNumber(70, 120); // Range of random numbers being sent
  client.publish(topic, randomNumber.toString());
  console.log('Published message:', randomNumber);
}, 5000); // The interval (in milliseconds) will adjust the publishing frequency

// Disconnect from the MQTT broker when done
setTimeout(() => {
  client.end();
}, 30000); // The timeout (in milliseconds) will adjust the duration of publishing
