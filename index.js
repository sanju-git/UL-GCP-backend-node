const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const app = express();
// Cloud Run port binding
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "https://ul-gcp-frontend-react-1076232659917.europe-west3.run.app",
      "http://localhost:5173",
    ],
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);

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
