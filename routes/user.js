const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, userController.get_users);
router.post("/", userController.post_user);

module.exports = router;
