const express = require("express");
const app = express();
const cors = require("cors");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const corsOptions = { origin: "*" };

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Cloud Run requires listening on process.env.PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
