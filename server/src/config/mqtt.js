const mqtt = require("mqtt");
const schedule = require("node-schedule");

const BOARDS_TOPIC = "boards/registry";
const DATABASE_NAME = "rdbc_db";
const COLLECTION_NAME = "boards";
const Board = require("../models/board.js");
const LogMessage = require("../models/message.js");

const pendingConfirmations = new Map();

const connectMQTT = (dbClient) => {
  const options = {
    username: "tester",
    password: "1234",
  };
  const client = mqtt.connect("mqtt://mosquitto:1883", options);

  client.on("connect", () => {
    console.log("Connected to MQTT server");
    client.subscribe(BOARDS_TOPIC, (err) => {
      if (!err) {
        console.log(`Suscription to topic '${BOARDS_TOPIC}' done`);
      }
    });
  });

  client.on("message", async (topic, message) => {
    console.log(`Message from topic '${topic}': ${message.toString()}`);

    try {
      if (topic.startsWith("boards/")) {
        const topicParts = topic.split("/");
        const boardName = topicParts[1];

        if (topicParts.length === 3 && topicParts[2] === "log") {
          console.log(
            `Log message from board '${boardName}': ${message.toString()}`
          );
          const board = await Board.findOne({ Device: boardName });
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
          const { Device, Ip, parameters } = JSON.parse(message.toString());

          const stringParameters = parameters.reduce((acc, item) => {
            const key = Object.keys(item)[0];
            acc[key] = String(item[key]);
            return acc;
          }, {});

          const protocol = Ip === "0.0.0.0" ? "LoRA" : "Wi-Fi";

          const result = await Board.findOneAndUpdate(
            { Device },
            {
              $set: {
                Device,
                Protocol: protocol,
                Ip,
                Status: "active",
                parameters: stringParameters,
              },
            },
            {
              upsert: true,
              new: true,
            }
          );

          console.log("Updated board in MongoDB:", result);

          client.subscribe(`boards/${Device}/log`, (err) => {
            if (err) {
              console.error("Error while subscribing to log topic:", err);
            } else {
              console.log(`Subscribed to topic boards/${Device}/log`);
            }
          });

          client.subscribe(`boards/${Device}/confirmation`, (err) => {
            if (err) {
              console.error(
                "Error while subscribing to confirmation topic:",
                err
              );
            } else {
              console.log(`Subscribed to topic boards/${Device}/confirmation`);
            }
          });
          client.subscribe(`boards/${Device}`, (err) => {
            if (err) {
              console.error("Error while subscribing to Device topic:", err);
            } else {
              console.log(`Subscribed to topic boards/${Device}`);
            }
          });
        } else {
          const msg = JSON.parse(message.toString());
          if (msg.id && pendingConfirmations.has(msg.id)) {
            const resolve = pendingConfirmations.get(msg.id);
            resolve(msg.status === "updated");
            pendingConfirmations.delete(msg.id);
          } else {
            const boardName = msg.Device;
            console.log("Active message received");
            updateStatus(boardName, "active");

            if (msg.status === "active") {
              schedule.scheduleJob("*/1 * * * *", () => {
                updateStatus(boardName, "inactive");
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error while processing message from topic:", error);
    }
  });

  function publishWithConfirmation(boardName, data) {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(2, 15);
      data.id = id;
      console.log("boardName: ", boardName);
      console.log("ID: ", data.id);
      client.publish(`boards/${boardName}`, JSON.stringify(data), {}, (err) => {
        if (err) {
          reject(err);
        } else {
          pendingConfirmations.set(id, resolve);
          console.log("Timeout");
          setTimeout(() => {
            if (pendingConfirmations.has(id)) {
              pendingConfirmations.delete(id);
              resolve(false);
            }
          }, 10000);
        }
      });
    });
  }

  async function updateStatus(boardName, status) {
    try {
      const updatedBoard = await Board.findOneAndUpdate(
        { Device: boardName },
        { Status: status },
        { new: true }
      );

      if (updatedBoard) {
        console.log(`Status of board '${boardName}' updated to '${status}'`);
      } else {
        console.log(`Board '${boardName}' not found`);
      }
    } catch (error) {
      console.error(`Error updating status of board '${boardName}':`, error);
    }
  }

  client.on("error", (error) => {
    console.error("MQTT connection error:", error);
  });

  return {
    publishWithConfirmation,
  };
};

module.exports = connectMQTT;
