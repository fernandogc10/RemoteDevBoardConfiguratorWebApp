const Board = require("../models/board");
const LogMessage = require("../models/message");
const { publishWithConfirmation } = require("../config/mqtt.js");

const getBoards = async (req, res) => {
  console.log("getBoards");

  try {
    const boards = await Board.find().exec();

    res.status(200).send(boards);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getBoardById = async (req, res) => {
  const { id } = req.params;

  try {
    const board = await Board.findById(id).exec();

    if (!board) {
      return res.status(404).send("Board not found");
    }

    const logs = await LogMessage.find({ board: board._id })
      .populate("board")
      .exec();

    console.log(logs);

    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

const saveBoard = async (req, res) => {
  try {
    await Board.create(req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateBoardParameters = async (req, res) => {
  console.log(req.body);
  const newParameters = req.body.parameters;
  const Device = req.body.Device;

  try {
    const confirmed = await req.mqttClient.publishWithConfirmation(
      `boards/${Device}`,
      {
        parameters: newParameters,
      }
    );

    if (confirmed) {
      const updatedBoard = await Board.findOneAndUpdate(
        { Device },
        { $set: { parameters: newParameters } },
        { new: true, returnDocument: "after" }
      );

      if (updatedBoard) {
        res.status(200).json(updatedBoard);
      } else {
        res.status(404).send("Board not found");
      }
    } else {
      res.status(503).send("Failed to update board parameters via MQTT");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};

module.exports = {
  saveBoard,
  getBoards,
  getBoardById,
  updateBoardParameters,
};
