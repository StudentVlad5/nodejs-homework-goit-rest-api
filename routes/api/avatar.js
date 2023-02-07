const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { cntrlWrap } = require("../../middleware/cntrlWrap");
const { filesController } = require("../../controllers/filesController");
const { v4: uuidv4 } = require("uuid");
const FILE_DIR = path.resolve("./public/avatars");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILE_DIR);
  },
  filename: (req, file, cb) => {
    const [, extension] = file.originalname.split(".");
    cb(null, `${uuidv4()}.${extension}`);
  },
});
const uploadMiddleware = multer({ storage });

router.post("/", uploadMiddleware.single("avatar"), cntrlWrap(filesController));
router.use("/", express.static(FILE_DIR));

module.exports = router;
