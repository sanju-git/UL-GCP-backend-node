const express = require("express");
const { getGCSData, uploadCsvToGcs } = require("../controllers/DataController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

router.get("/get-gcs-data", authMiddleware, getGCSData);
router.post("/upload-csv", authMiddleware, uploadCsvToGcs);

module.exports = router;
