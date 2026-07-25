const express = require("express");
const router = express.Router();
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public endpoints
router.get("/", getCertificates);

// Protected endpoints (admin only)
router.post("/", protect, upload.single("image"), createCertificate);
router.put("/:id", protect, upload.single("image"), updateCertificate);
router.delete("/:id", protect, deleteCertificate);

module.exports = router;
