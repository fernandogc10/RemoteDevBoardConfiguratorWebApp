require("dotenv").config();
const User = require("../models/user");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth_user = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.API_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "The user already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User creation successful" });
  } catch (error) {
    console.error("Error registering user ", error);
    res.status(500).json({ message: "Error in server" });
  }
};
module.exports = {
  auth_user,
  registerUser,
};
