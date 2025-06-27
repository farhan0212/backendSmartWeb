const express = require("express");
const Detection = require("../Schema/Detection");
const router = express.Router();

router.post("/detections", async (req, res) => {
  try {
    const { predictions } = req.body;

    console.log("🟡 Received predictions:", predictions);

    const savedDetections = await Promise.all(
      predictions.map(async (pred, i) => {
        console.log(`🔍 [${i}] class:`, pred.class);
        console.log(`🔍 [${i}] score:`, pred.score);
        console.log(`🔍 [${i}] bbox:`, pred.bbox);

        if (
          !pred.class ||
          typeof pred.score !== "number" ||
          !Array.isArray(pred.bbox) ||
          pred.bbox.length !== 4
        ) {
          console.warn(`⚠️ Skipping invalid prediction at index ${i}`);
          return null;
        }

        const detection = new Detection({
          label: pred.class,
          confidence: Math.round(pred.score * 100), // convert to percentage
          boundingBox: {
            x: pred.bbox[0],
            y: pred.bbox[1],
            width: pred.bbox[2],
            height: pred.bbox[3],
          },
          timestamp: new Date(),
        });

        return await detection.save();
      })
    );

    const filtered = savedDetections.filter((d) => d !== null);

    res.status(201).json({
      message: "Detections saved successfully",
      count: filtered.length,
      detections: filtered,
    });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
});

module.exports = router;
