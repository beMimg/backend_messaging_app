const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");
const conversationRouter = require("./conversation");

router.get("/", isAuthenticated, userController.get_users);

router.post("/", userController.post_user);

router.put("/bio", isAuthenticated, userController.put_user_bio);

// If is Authenticated and is the owner of the account, follow the :followed_user_id.
router.post(
  "/follow/:followed_user_id",
  isAuthenticated,
  userController.post_follow
);

router.delete(
  "/:user_id/follow/:followed_user_id",
  isAuthenticated,
  isOwnerOfAccount,
  userController.delete_follow
);

router.use("/:user_id/conversation", conversationRouter);

module.exports = router;
