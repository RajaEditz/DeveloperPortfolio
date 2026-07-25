const express = require("express");
const router = express.Router();
const {
  getProfilePhoto,
  updateProfilePhoto,
  deleteProfilePhoto,
} = require("../controllers/profilePhotoController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public GET route
router.get("/", getProfilePhoto);

// Protected PUT route (multipart/form-data upload)
router.put("/", protect, upload.single("profile_photo"), updateProfilePhoto);

// Protected DELETE route
router.delete("/", protect, deleteProfilePhoto);

module.exports = router;
