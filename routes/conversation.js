const express = require("express");
const router = express.Router({ mergeParams: true });
const conversationController = require("../controllers/conversationController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");
const messageRouter = require("./message");

router.post(
  "/",
  isAuthenticated,
  isOwnerOfAccount,
  conversationController.post_conversation
);

router.use("/:conversation_id/message", messageRouter);

module.exports = router;
