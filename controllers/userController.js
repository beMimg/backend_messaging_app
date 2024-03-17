const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.get_users = async (req, res, next) => {
  try {
    const users = await User.find({}, "username");

    if (users.length === 0) {
      return res.status(200).json({ message: "There are no users yet." });
    }
    return res.status(200).json({ users: users });
  } catch (err) {
    return next(err);
  }
};

exports.post_user = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage("Username must have at least 3 characters."),
  body("email").trim().isEmail().escape().withMessage("Email is not valid."),
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name is not valid."),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name is not valid."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .escape(),
  body("password_confirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords didn't match."),

  async (req, res, next) => {
    const errors = validationResult(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const usernameLowerCase = await req.body.username.toLowerCase();
    // The variable usernameLowerCase is created to prevent users from creating accounts with the same username
    // despite different cases. This ensures uniqueness and helps prevent user confusion.
    // It stores the lowercase version of the username, which is used for comparison during account creation
    // and validation processes to enforce case-insensitive uniqueness.
    const user = new User({
      username: req.body.username,
      usernameLowerCase: usernameLowerCase,
      email: req.body.email,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: hashedPassword,
      creation: Date.now(),
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existsUsernameLowerCase = await User.findOne({
      usernameLowerCase: usernameLowerCase,
    });

    if (existsUsernameLowerCase) {
      return res.status(409).json({ message: "This user already exists." });
    } else {
      await user.save();
      return res.status(200).json({
        message:
          "You have successfully signed up. Please log in to start using our services",
      });
    }
  },
];

exports.put_user_bio = [
  body("bio")
    .isLength({ max: 65 })
    .withMessage("Bio must have maximum of 65 characters.")
    .isLength({ min: 1 })
    .withMessage("Bio must have at least one character."),

  async (req, res, next) => {
    try {
      const existsUser = await User.findById(req.params.user_id);

      if (!existsUser) {
        return res.status(404).json({ errors: "User not found" });
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors });
      }

      await User.findByIdAndUpdate(
        req.params.user_id,
        { bio: req.body.bio },
        {}
      );

      return res.status(200).json({
        message: `User ${req.params.user_id} bio was updated to ${req.body.bio} `,
      });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return next(err);
    }
  },
];

exports.post_follow = async (req, res, next) => {
  // find the user that follows (req.user_id) and populate following
  // following push followed_user_id
  try {
    const user = await User.findById(req.user.user._id, "following");

    const followedUser = await User.findById(
      req.params.followed_user_id,
      "username"
    );

    if (!followedUser) {
      return res.status(404).json({ errors: "Followed user not found." });
    }

    const alreadyFollowing = user.following.includes(
      req.params.followed_user_id
    );

    if (alreadyFollowing) {
      return res.status(409).json({ errors: "User already followed." });
    }

    user.following.push(req.params.followed_user_id);

    await user.save();

    return res.status(200).json({
      message: `You are now following ${followedUser.username}`,
      following: user.following,
    });
  } catch (err) {
    return next(err);
  }
};
