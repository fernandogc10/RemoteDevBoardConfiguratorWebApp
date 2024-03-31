const Board = require("../models/board");

const getBoards = async (req, res) => {
  console.log("getBoard");

  try {
    const boards = await Board.find().exec();
    res.status(200).send(boards);
    console.log(accounts);
  } catch (err) {
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
  const { name } = req.params;
  const newParameters = req.body.parameters;

  try {
    const updatedBoard = await Board.findOneAndUpdate(
      { name },
      { $set: { parameters: new Map(Object.entries(newParameters)) } },
      { new: true, returnDocument: "after" }
    );

    if (updatedBoard) {
      res.status(200).json(updatedBoard);
    } else {
      res.status(404).send("Board not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

module.exports = {
  saveBoard,
  getBoards,
  updateBoardParameters,
};
