const express = require("express");
const app = express();
const cors = require("cors");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api", dataFetchRoutes);

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
