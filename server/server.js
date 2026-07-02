const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
 const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/applications", applicationRoutes);
app.get("/", (req, res) => {
  res.send("CareerConnect backend is running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
