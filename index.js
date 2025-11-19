const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const app = express();
// Cloud Run port binding
const PORT = process.env.PORT || 8080;

// app.use(
//   cors({
//     origin: [
//       "https://ul-gcp-frontend-react-1076232659917.europe-west3.run.app/",
//       "http://localhost:5173",
//     ],
//     methods: ["GET,POST,PUT,DELETE,PATCH"],
//     allowedHeaders: ["Content-Type,Authorization"],
//   })
// );
// app.options("/", cors());

const allowedOrigins = [
  "https://ul-gcp-frontend-react-1076232659917.europe-west3.run.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Or, if you want to allow requests from any origin (less secure for production but useful for development):
// app.use(cors());

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Attach API routes
app.use("/api", dataFetchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });
