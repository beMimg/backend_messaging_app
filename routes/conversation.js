const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");
const messageRouter = require("./message");

router.post(
  "/:participant_id",
  isAuthenticated,
  conversationController.post_conversation
);

router.use(
  "/:conversation_id/message",
  isAuthenticated,
  isOwnerOfAccount,
  messageRouter
);

module.exports = router;
