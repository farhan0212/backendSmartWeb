const mongoose = require("mongoose");

const detectionSchema = new mongoose.Schema({
  label: String,
  confidence: Number,
  boundingBox: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Detection", detectionSchema);
