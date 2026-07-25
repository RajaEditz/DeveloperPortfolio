const express = require("express");
const router = express.Router();
const {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
} = require("../controllers/publicationController");
const { protect } = require("../middleware/authMiddleware");

// Public endpoints
router.get("/", getPublications);

// Protected endpoints (admin only)
router.post("/", protect, createPublication);
router.put("/:id", protect, updatePublication);
router.delete("/:id", protect, deletePublication);

module.exports = router;
