const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  isAuthenticated,
  isOwnerOfAccount,
} = require("../middleware/authMiddleware");

router.get("/", isAuthenticated, userController.get_users);
router.post("/", userController.post_user);
router.put(
  "/:user_id/bio",
  isAuthenticated,
  isOwnerOfAccount,
  userController.put_user_bio
);
router.post(
  "/:user_id/follow/:followed_user_id",
  isAuthenticated,
  isOwnerOfAccount,
  userController.post_follow
);

module.exports = router;
