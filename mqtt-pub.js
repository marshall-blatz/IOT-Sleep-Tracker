const mqtt = require('mqtt');

const MQTT_SERVER = 'mqtt://broker.mqttdashboard.com'; 
const MQTT_TOPIC = 'iowa-iot-project/sleep-data';
const RANGE_MIN = 60; // Minimum value of the range
const RANGE_MAX = 110; // Maximum value of the range
const PUBLISH_INTERVAL_MS = 2000; // Interval in milliseconds to publish the number

// Calculate the middle value of the range
const RANGE_MIDDLE = Math.floor((RANGE_MIN + RANGE_MAX) / 2);

let currentValue = RANGE_MIDDLE; // Initial value of the number set to the middle of the range
let direction = -1
// Create an MQTT client instance
const client = mqtt.connect(MQTT_SERVER);

// Publish the current value to the MQTT topic
function publishNumber() {
  // Generate a random increment between 0 and 3 for each call to publishNumber()
  const increment = getRandomInt(0, 4)

  // Update the current value based on the increment
  currentValue += increment * direction;

  client.publish(MQTT_TOPIC, currentValue.toString());
  console.log(`Published: ${currentValue}, Increment: ${increment}`);

  // If the current value reaches the maximum or minimum of the range, change the increment
  if (currentValue >= RANGE_MAX) {
    currentValue = RANGE_MAX - 1
    direction *= -1
  }
  if (currentValue <= RANGE_MIN) {
    currentValue = RANGE_MIN + 1
    direction *= -1
  }
}

// Connect to the MQTT server
client.on('connect', () => {
  console.log(`Connected to MQTT server: ${MQTT_SERVER}`);

  // Publish the initial value to the MQTT topic
  publishNumber();

  // Start the interval for publishing the number
  setInterval(publishNumber, PUBLISH_INTERVAL_MS);
});

// Handle MQTT errors
client.on('error', (error) => {
  console.error(`MQTT error: ${error}`);
});

// Close the MQTT client on exit
process.on('SIGINT', () => {
  console.log('Closing MQTT client');
  client.end();
  process.exit();
});

// Utility function to get a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
