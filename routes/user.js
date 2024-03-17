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

module.exports = router;
