const express = require("express");
const { getGCSData, uploadCsvToGcs } = require("../controllers/DataController");
const router = express.Router();
// const {
//   processAudioPrompt,
//   processTextPrompt,
// } = require("../controllers/lexController");

// router.post("/audio-prompt", validateAuthToken, upload.single("audio"), processAudioPrompt);
router.get("/get-gcs-data", getGCSData);
router.post("/upload-csv", uploadCsvToGcs);

module.exports = router;
