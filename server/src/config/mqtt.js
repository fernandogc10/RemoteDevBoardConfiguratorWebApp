const mqtt = require("mqtt");

const MQTT_TOPIC = "boards/registry";
const DATABASE_NAME = "rdbc_db";
const COLLECTION_NAME = "boards";

const connectMQTT = (dbClient) => {
  const client = mqtt.connect("mqtt://localhost:1883");

  client.on("connect", () => {
    console.log("Connected to MQTT server");
    client.subscribe(MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`Suscription to topic '${MQTT_TOPIC}' done`);
      }
    });
  });

  client.on("message", async (topic, message) => {
    console.log(`Message from topic '${topic}': ${message.toString()}`);

    try {
      const { name, ip, parameters } = JSON.parse(message);

      const result = await Board.findOneAndUpdate(
        { name },
        {
          $set: {
            name,
            ip,
            parameters: new Map(Object.entries(parameters)),
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      console.log("Updated board in MongoDB:", result);
    } catch (error) {
      console.error("Error while processing message from topic:", error);
    }
  });

  client.on("error", (error) => {
    console.error("MQTT connection error:", error);
  });
};

module.exports = connectMQTT;
