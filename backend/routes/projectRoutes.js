const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected routes (admin only)
router.post(
  "/",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 15 },
  ]),
  createProject
);
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 15 },
  ]),
  updateProject
);
router.delete("/:id", protect, deleteProject);

module.exports = router;