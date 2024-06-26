const express = require("express");
const router = express.Router();
const user_controller = require("../controllers/user");

router.post("/", user_controller.registerUser);
router.post("/login", user_controller.auth_user);

module.exports = router;
