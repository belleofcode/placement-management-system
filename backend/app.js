require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS: Origin not allowed"));
  },
  credentials: true
}));
app.use(express.json());

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (e) { res.status(500).json({ message: "Database connection failed", error: e.message }); }
});

app.get("/api/health", (req, res) => res.json({ ok: true, message: "Placement Management API is running" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/opportunities", require("./routes/opportunityRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.use((err, req, res, next) => res.status(500).json({ message: err.message || "Server error" }));
module.exports = app;
