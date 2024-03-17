require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) res.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.isOwnerOfAccount = async (req, res, next) => {
  try {
    if (req.user.user._id !== req.params.user_id) {
      return res
        .status(401)
        .json({ error: "You are not the owner of this account." });
    } else {
      next();
    }
  } catch (err) {
    console.error("Error in isOwnerOfAccount middleware:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
