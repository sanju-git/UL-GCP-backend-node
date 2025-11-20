const { Storage } = require("@google-cloud/storage");
const path = require("path"); // Import path to get the filename
const multer = require("multer");

const storage = new Storage();
const myBucket = "multiclouddev";

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
