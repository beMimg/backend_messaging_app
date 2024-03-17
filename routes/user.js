const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.post_user);

module.exports = router;
