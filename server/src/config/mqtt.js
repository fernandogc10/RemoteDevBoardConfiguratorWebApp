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
      if (topic.startsWith("boards/")) {
        const topicParts = topic.split("/");
        const boardName = topicParts[1]; // Extrayendo el nombre de la placa del tema

        if (topicParts.length === 3 && topicParts[2] === "log") {
          // Mensaje de log
          console.log(
            `Log message from board '${boardName}': ${message.toString()}`
          );
          // Guardar el mensaje de log en MongoDB
          const board = await Board.findOne({ name: boardName });
          if (board) {
            const newLogMessage = new LogMessage({
              board: board._id,
              message: message.toString(),
            });
            await newLogMessage.save();
            console.log("Log message saved to MongoDB");
          } else {
            console.error(`Board '${boardName}' not found`);
          }
        } else if (topicParts.length === 2 && topicParts[1] === "registry") {
          // Mensaje de registro
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

          // Suscribirse al tema boards/nombre_de_la_placa/log
          client.subscribe(`boards/${name}/log`, (err) => {
            if (err) {
              console.error("Error while subscribing to log topic:", err);
            } else {
              console.log(`Subscribed to topic boards/${name}/log`);
            }
          });
        }
      }
    } catch (error) {
      console.error("Error while processing message from topic:", error);
    }
  });

  client.on("error", (error) => {
    console.error("MQTT connection error:", error);
  });
};

module.exports = connectMQTT;
