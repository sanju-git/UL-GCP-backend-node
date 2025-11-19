const express = require("express");
const app = express();
const cors = require("cors");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

// 1. Define options
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"], // Allow standard headers
};

// 2. Apply CORS middleware globally
app.use(cors(corsOptions));

// 3. IMPORTANT: Enable Preflight handling explicitly
// This forces Express to respond to OPTIONS requests with a 200 OK and the CORS headers
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api", dataFetchRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
