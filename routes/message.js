const express = require("express");
const router = express.Router({ mergeParams: true });
const messageController = require("../controllers/messageController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  isAuthenticated,
  isOwnerOfAccount,
  messageController.post_message
);

module.exports = router;
