const express = require("express");
const { getGCSData, uploadCsvToGcs } = require("../controllers/DataController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Allow OPTIONS for all routes inside /api/*
router.options("/*", (req, res) => {
  res.sendStatus(204);
});

// Protected routes
router.get("/get-gcs-data", authMiddleware, getGCSData);
router.post("/upload-csv", authMiddleware, uploadCsvToGcs);

module.exports = router;