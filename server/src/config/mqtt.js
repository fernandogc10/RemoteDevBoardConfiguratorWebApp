const mqtt = require("mqtt");

const MQTT_TOPIC = "boards/registry";
const DATABASE_NAME = "rdbc_db";
const COLLECTION_NAME = "boards";

const connectMQTT = () => {
  const client = mqtt.connect("mqtt://localhost:1883");

  client.on("connect", () => {
    console.log("Conectado al broker MQTT");
    client.subscribe(MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`Suscripción al topic '${MQTT_TOPIC}' exitosa`);
      }
    });
  });

  client.on("message", async (topic, message) => {
    console.log(
      `Mensaje recibido en el topic '${topic}': ${message.toString()}`
    );

    try {
      const boardInfo = JSON.parse(message);
      const collection = dbClient.db(DATABASE_NAME).collection(COLLECTION_NAME);
      await collection.insertOne(boardInfo);
      console.log("Board registrada en MongoDB:", boardInfo);
    } catch (error) {
      console.error("Error guardando board en MongoDB:", error);
    }
  });

  client.on("error", (error) => {
    console.error("Error de conexión MQTT:", error);
  });
};

module.exports = connectMQTT;
