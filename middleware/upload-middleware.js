const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// file filter
const checkFIleFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.startsWith("application/pdf")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only image or pdf file"));
  }
};

// multer middleware
module.exports = multer({
  storage: storage,
  fileFilter: checkFIleFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
