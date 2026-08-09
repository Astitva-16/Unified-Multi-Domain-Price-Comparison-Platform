const express = require("express");
const multer = require("multer");

const {
  imageSearch,
} = require("../controllers/imageSearchController");

const router = express.Router();


const storage =
  multer.memoryStorage();


const upload =
  multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });


router.post(
  "/",
  upload.single("image"),
  imageSearch
);


module.exports = router;