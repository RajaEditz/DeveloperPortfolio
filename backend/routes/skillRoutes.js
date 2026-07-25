const express = require("express");
const router = express.Router();
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");

// Public endpoints
router.get("/", getSkills);

// Protected endpoints (admin only)
router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;
