const express = require("express");
const router = express.Router();

const { getGCSData, uploadCsvToGcs, getSQLData, getProductByCode, updateProductName} = require("../controllers/DataController");
// const authMiddleware = require("../middleware/auth");

// Protected routes
router.get("/get-gcs-data", getGCSData);
router.post("/upload-csv", uploadCsvToGcs);
router.get("/get-sql-data", getSQLData);
router.get("/get-sql-data/:productcode", getProductByCode); 
router.put("/get-sql-data/:productcode", updateProductName);  
// router.get("/get-uc-data", getUCProductMappingData);  
// router.post("/insert-uc-data", insertUCProductMappingData);

module.exports = router;
