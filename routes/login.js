const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { createGuest } = require("../utils/utils");

router.post("/", async (req, res, next) => {
  try {
    // The variable usernameLowerCase is created to prevent users from creating accounts with the same username
    // despite different cases. This ensures uniqueness and helps prevent user confusion.
    // It stores the lowercase version of the username, which is used for comparison during account creation
    // and validation processes to enforce case-insensitive uniqueness.
    const usernameLowerCase = await req.body.username.toLowerCase();

    // only need password of the user the authenticate,
    // have all the properties of User Schema will enlarge the token.
    // specially if you have a binary base64 encode profile picture

    const user = await User.findOne(
      { usernameLowerCase: usernameLowerCase },
      "password"
    );

    if (!user) {
      return res.status(404).json({ errors: "User not found." });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(404).json({ errors: "Incorrect password." });
    }

    jwt.sign(
      { user: user },
      process.env.SECRET_KEY,
      { expiresIn: "2d" },
      (err, token) => {
        res.json({ token: token });
      }
    );
  } catch (err) {
    return next(err);
  }
});

router.post("/guest", async (req, res, next) => {
  try {
    const { first_name, username, usernameLowerCase, email, password } =
      createGuest();

    const existsUsernameLowerCase = await User.findOne({
      usernameLowerCase: usernameLowerCase,
    });

    if (existsUsernameLowerCase) {
      return res.status(409).json({
        errors: [
          { msg: "This username already exists, please choose another one." },
        ],
      });
    }
    const user = new User({
      username: username,
      usernameLowerCase: usernameLowerCase,
      email: email,
      first_name: first_name,
      password: password,
      creation: Date.now(),
    });

    await user.save();

    jwt.sign(
      { user: user },
      process.env.SECRET_KEY,
      { expiresIn: "2d" },
      (err, token) => {
        res.json({ token: token });
      }
    );
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
