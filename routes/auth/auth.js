const express = require("express");
const router = express.Router();

// Hash
const bcrypt = require("bcryptjs");

// JWT
const jwt = require("jsonwebtoken");

// User model
const User = require("../../models/user");

// Register user route
router.post("/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;

  // Validations
  if (!username || typeof username !== "string" || username.length < 3)
    return res
      .status(400)
      .json({ status: "error", message: "Invalid username" });

  if (
    !plainTextPassword ||
    typeof plainTextPassword !== "string" ||
    plainTextPassword.length < 6
  )
    return res
      .status(400)
      .json({ status: "error", message: "Invalid password" });

  //Hashing the password
  const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

  try {
    const user = await User.create({
      username,
      password: hashedPassword,

      // Default values for a user
      isAdmin: false,
    });

    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    // MongoDB unique index error
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Username already exists",
      });
    }

    return res.status(500).json({ status: "error", message: error });
  }
});

// Login user route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validations
  if (
    !username ||
    typeof username !== "string" ||
    !password ||
    typeof password !== "string"
  )
    return res.status(400).json({
      status: "error",
      message: "Enter all details",
    });

  const user = await User.findOne({ username }).lean();

  if (!user)
    return res.status(400).json({
      status: "error",
      message: "Invalid username or password",
    });

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (isPasswordValid) {
    const token = jwt.sign(
      { id: user._id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    return res.status(200).json({ status: "success", data: token });
  }

  res.status(400).json({
    status: "error",
    message: "Invalid username or password",
  });
});

module.exports = router;
