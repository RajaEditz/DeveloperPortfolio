const express = require("express");
const router = express.Router();
const {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");
const { protect } = require("../middleware/authMiddleware");

// Public endpoints
router.get("/", getExperiences);

// Protected endpoints (admin only)
router.post("/", protect, createExperience);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);

module.exports = router;
