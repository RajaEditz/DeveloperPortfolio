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
router.post("/", protect, upload.array("images", 15), createCertificate);
router.put("/:id", protect, upload.array("images", 15), updateCertificate);
router.delete("/:id", protect, deleteCertificate);

module.exports = router;
