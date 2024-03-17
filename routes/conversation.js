const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");

router.post(
  "/:user_id",
  isAuthenticated,
  isOwnerOfAccount,
  conversationController.post_conversation
);

module.exports = router;
