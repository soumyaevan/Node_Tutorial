const express = require("express");
const {
  registerUser,
  loginUser,
  changePassword,
  sendResetPassword,
  resetPassword,
} = require("../controllers/auth-controller");
const authMiddleware = require("../middleware/auth-middleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/changePassword", authMiddleware, changePassword);
router.post("/sendResetEmail", sendResetPassword);
router.get("/reset/:token", resetPassword);

module.exports = router;
