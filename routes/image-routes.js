const express = require("express");

const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {
  uploadImageController,
  fetchImageController,
  deleteImageController,
} = require("../controllers/storage-controller");
const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image", "pdf"),
  uploadImageController
);
router.get("/getFiles", authMiddleware, fetchImageController);
router.delete(
  "/deleteFile/:id",
  authMiddleware,
  adminMiddleware,
  deleteImageController
);
module.exports = router;
