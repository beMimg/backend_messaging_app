const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");

router.post(
  "/:user_id",
  isAuthenticated,
  isOwnerOfAccount,
  messageController.post_message
);
