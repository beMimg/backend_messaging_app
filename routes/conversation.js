const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const messageRouter = require("./message");

router.post(
  "/:participant_id",
  isAuthenticated,
  conversationController.post_conversation
);

// gets all conversations of a user.
router.get("/", isAuthenticated, conversationController.get_conversations);

router.use("/:conversation_id/message", messageRouter);

module.exports = router;
