const express = require("express");
const { getGCSData, uploadCsvToGcs } = require("../controllers/DataController");
const router = express.Router();

router.get("/get-gcs-data", getGCSData);
router.post("/upload-csv", uploadCsvToGcs);

module.exports = router;
