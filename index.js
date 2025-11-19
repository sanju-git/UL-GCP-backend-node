const express = require("express");
const cors = require("cors");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const app = express();

app.use(cors()); // Enable CORS
app.options("*", cors()); // Enable preflight everywhere

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api/data", dataFetchRoutes);

// Cloud Run uses PORT env variable
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
