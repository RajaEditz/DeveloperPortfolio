const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const skillRoutes = require("./routes/skillRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const publicationRoutes = require("./routes/publicationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profilePhotoRoutes = require("./routes/profilePhotoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile-photo", profilePhotoRoutes);

app.get("/", (req, res) => {
  res.send("Portfolio Backend API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});