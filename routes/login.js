const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/", async (req, res, next) => {
  try {
    // The variable usernameLowerCase is created to prevent users from creating accounts with the same username
    // despite different cases. This ensures uniqueness and helps prevent user confusion.
    // It stores the lowercase version of the username, which is used for comparison during account creation
    // and validation processes to enforce case-insensitive uniqueness.
    const usernameLowerCase = await req.body.username.toLowerCase();

    const user = await User.findOne({ usernameLowerCase: usernameLowerCase });

    if (!user) {
      return res.status(404).json({ errors: "User not found." });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(404).json({ errors: "Incorrect password." });
    }

    jwt.sign({ user: user }, process.env.SECRET_KEY, (err, token) => {
      res.json({ token: token });
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
