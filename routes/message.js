const express = require("express");
const router = express.Router({ mergeParams: true });
const messageController = require("../controllers/messageController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.post("/", isAuthenticated, messageController.post_message);

module.exports = router;
