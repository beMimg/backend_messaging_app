const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const conversationRouter = require("./conversation");

router.get("/", isAuthenticated, userController.get_users);

router.post("/", userController.post_user);

router.put("/bio", isAuthenticated, userController.put_user_bio);

router.post(
  "/follow/:followed_user_id",
  isAuthenticated,
  userController.post_follow
);

router.delete(
  "/follow/:followed_user_id",
  isAuthenticated,
  userController.delete_follow
);

router.use("/:user_id/conversation", conversationRouter);

module.exports = router;
