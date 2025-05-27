const express = require("express");
const multer = require("multer");
const Detection = require("../Schema/Detection");
const router = express.Router();
const path = require("path");

// Setup multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + path.extname(file.originalname)),
// });
// const upload = multer({ storage });

router.post("/detections", async (req, res) => {
  try {
    const { label, confidence, boundingBox } = req.body;

    const detection = new Detection({
      label,
      confidence: parseFloat(confidence),
      boundingBox: JSON.parse(boundingBox),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await detection.save();
    res.status(201).json({ message: "Detection saved successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
