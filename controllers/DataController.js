const { Storage } = require("@google-cloud/storage");
const path = require("path"); // Import path to get the filename
const multer = require("multer");
const { query } = require("../config/dbQuery");
const storage = new Storage();
const myBucket = "multiclouddev";
const { getDBXClient } = require("../config/databricks");
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Simple filter for 'text/csv'
    if (file.mimetype === "text/csv") {
      cb(null, true);
    } else {
      cb(new Error("Only .csv files are allowed!"), false);
    }
  },
});
exports.getGCSData = (req, res) => {
  try {
    const myFile =
      "uploads/1763618091602-test.csv";
    const remoteFile = storage.bucket(myBucket).file(myFile);
    const filename = path.basename(myFile);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "text/csv");
    const readStream = remoteFile.createReadStream();
    readStream.on("error", (err) => {
      console.error(err);
      res.status(500).send("Error streaming file from GCS.");
    });
    readStream.pipe(res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
exports.uploadCsvToGcs = (req, res, next) => {
  // 1. Handle the Multer upload
  multerMid.single("csvFile")(req, res, async (err) => {
    // Handle Multer-specific errors (like file type or size)
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    // 2. Check if a file was even uploaded
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }
    // 3. Set the destination path in GCS
    // We'll use the original file name and put it in an 'uploads' folder
    const gcsFileName = `uploads/${Date.now()}-${req.file.originalname}`;
    const file = storage.bucket(myBucket).file(gcsFileName);
    // 4. Use GCS to save the file from the memory buffer
    try {
      // 'req.file.buffer' contains the file's data
      await file.save(req.file.buffer, {
        contentType: "text/csv",
      });
      // 5. Send a success response
      const publicUrl = `https://storage.googleapis.com/${myBucket}/${gcsFileName}`;
      res.status(200).send({
        message: "File uploaded successfully.",
        fileName: gcsFileName,
        url: publicUrl,
      });
    } catch (error) {
      // Handle GCS errors (e.g., permissions)
      console.error("GCS Upload Error:", error);
      res.status(500).send({ message: "Failed to upload file to GCS." });
    }
  });
};
// exports.getSQLData = async (req, res) => {
//   try {
//     const products = await getAllProducts();
//     // const user = await getUserById(req.params.id);
//     res.json({ success: true, data: products });
//   } catch (error) {
//     console.error("SQL Query Error:", error);
//     res.status(500).send({ message: "Failed to fetch data from SQL." });
//   }
// };
// async function getAllProducts() {
//   return query("SELECT external_product_name, global_product_code FROM ref_product_mapping");
// }
// async function getUserById(id) {
//   return query("SELECT id, name, email FROM users WHERE id = ?", [id]);
// }
// 1. Get all products (code + name)
exports.getSQLData = async (req, res) => {
  try {
    const result = await query(
      "SELECT global_product_code, external_product_name FROM ref_product_mapping"
    );
    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
// 2. Get single product by code
exports.getProductByCode = async (req, res) => {
  try {
    const { productcode } = req.params;
    const result = await query(
      "SELECT external_product_name FROM ref_product_mapping WHERE global_product_code = @code",
      { code: productcode }
    );
    res.json({ success: true, name: result[0]?.external_product_name || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};
// 3. Update product name
exports.updateProductName = async (req, res) => {
  try {
    const { productcode } = req.params;
    const { newName } = req.body;
    console.log("Product Code", productcode)
    console.log("New Name", newName)
    await query(
      "UPDATE ref_product_mapping SET external_product_name = @newName WHERE global_product_code = @productcode",
      { productcode, newName }
    );
    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update product" });
  }
};
exports.getUCProductMappingData = async (req, res) => {
  let sqlSession = null;
  try {
    const client = await getDBXClient();
    sqlSession = await client.openSession();
    const result = await sqlSession.executeStatement(`
      SELECT * 
      FROM multiclouddev_we2.raw.ref_product_mapping
      LIMIT 20
    `);
    const rows = await result.fetchAll();
    res.json({ data: rows });
  } catch (err) {
    console.error("Databricks error:", err);
    res.status(500).json({ error: "Databricks query failed" });
  } finally {
    if (sqlSession) {
      await sqlSession.close();
    }
  }
};
exports.insertUCProductMappingData = async (req, res) => {
  let sqlSession = null;
  try {
    const { external_product_name, global_product_code } = req.body;
    console.log(external_product_name, global_product_code);

    if (!external_product_name || !global_product_code) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const client = await getDBXClient();
    sqlSession = await client.openSession();

    const insertQuery = `
      INSERT INTO multiclouddev_we2.raw.ref_product_mapping
      VALUES ('${external_product_name}', '${global_product_code}')
    `;

    await sqlSession.executeStatement(insertQuery);
    await sqlSession.executeStatement("COMMIT");

    res.json({ success: true, message: "Product inserted successfully" });
  } catch (err) {
    console.error("Insert UC Product Error:", err);
    res.status(500).json({ error: "Insert failed" });
  } finally {
    if (sqlSession) {
      await sqlSession.close();
    }
  }
};
