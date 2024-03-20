const mqtt = require("mqtt");
let client;

const connectMQTT = () => {
  client = mqtt.connect("mqtt://tu_servidor_mqtt:1883");

  client.on("connect", () => {
    console.log("Conectado al broker MQTT");
  });

  client.on("message", (topic, message) => {
    console.log(
      `Mensaje recibido en el tema '${topic}': ${message.toString()}`
    );
  });

  client.on("error", (error) => {
    console.error("Error de conexión MQTT:", error);
  });
};

const publishMessage = (topic, message) => {
  client.publish(topic, message);
};

module.exports = { connectMQTT, publishMessage };
