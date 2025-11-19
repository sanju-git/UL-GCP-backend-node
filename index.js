const express = require("express");
const app = express();
const cors = require("cors");
const dataFetchRoutes = require("./routes/dataFetchRoutes");

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://ul-gcp-frontend-react-1076232659917.europe-west3.run.app",
];

// const corsOptions = { origin: "*" };

// app.use(cors(corsOptions));

// Configure CORS to work for local development and for deployments like Cloud Run.
// - Use `ALLOWED_ORIGINS` env var (comma-separated) to whitelist origins.
// - If `ALLOWED_ORIGINS` is not set, default to the local dev origin.
const allowedOrigins = ALLOWED_ORIGINS
  ? ALLOWED_ORIGINS.split(",").map((s) => s.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(
        new Error("CORS policy does not allow this origin."),
        false
      );
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.use("/api", dataFetchRoutes);

// Cloud Run requires listening on process.env.PORT
const PORT = process.env.PORT || 8080;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// Bind to 0.0.0.0 so the container (Cloud Run) can receive external traffic.
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
