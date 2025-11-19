const express = require("express");
const router = express.Router();

const { getGCSData, uploadCsvToGcs } = require("../controllers/DataController");
const authMiddleware = require("../middleware/auth");

// Protected routes
router.get("/get-gcs-data", authMiddleware, getGCSData);
router.post("/upload-csv", authMiddleware, uploadCsvToGcs);

module.exports = router;