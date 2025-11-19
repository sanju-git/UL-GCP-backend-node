const express = require("express");
const app = express();
const cors = require("cors");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const corsOptions = {
  origin: "*", // Cloud Run requires dynamic frontends, avoid localhost restriction
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// API routes
app.use("/api", dataFetchRoutes);

// Cloud Run requires listening on process.env.PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

