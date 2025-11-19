const express = require("express");
const cors = require("cors");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const app = express();

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle all OPTIONS requests globally (important for Cloud Run)
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Attach API routes
app.use("/api", dataFetchRoutes);

// Cloud Run port binding
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});