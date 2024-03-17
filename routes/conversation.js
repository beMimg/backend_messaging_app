const express = require("express");
const router = express.Router({ mergeParams: true });
const conversationController = require("../controllers/conversationController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  isAuthenticated,
  isOwnerOfAccount,
  conversationController.post_conversation
);

module.exports = router;
