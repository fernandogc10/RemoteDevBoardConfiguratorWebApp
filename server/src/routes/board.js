const express = require("express");
const router = express.Router();

const board_controller = require("../controllers/board.js");

router.post("/", board_controller.saveBoard);

router.get("/", board_controller.getBoards);

module.exports = router;
