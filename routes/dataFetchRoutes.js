const express = require("express");
const { getGCSData, uploadCsvToGcs } = require("../controllers/DataController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
// const {
//   processAudioPrompt,
//   processTextPrompt,
// } = require("../controllers/lexController");

// router.post("/audio-prompt", validateAuthToken, upload.single("audio"), processAudioPrompt);
router.get("/get-gcs-data", authMiddleware, getGCSData);
router.post("/upload-csv", authMiddleware, uploadCsvToGcs);

module.exports = router;
