const express = require("express");
const router = express.Router();
const { getContactInfo, updateContactInfo } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public endpoint
router.get("/", getContactInfo);

// Protected update endpoint (handles PDF/Word file uploads)
router.put("/", protect, upload.single("resume"), updateContactInfo);

module.exports = router;
