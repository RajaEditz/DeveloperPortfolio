const express = require("express");
const router = express.Router();
const {
  getMessages,
  createMessage,
  toggleMessageRead,
  deleteMessage,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// Public endpoint for contact form submission
router.post("/", createMessage);

// Protected endpoints for admin dashboard inbox
router.get("/", protect, getMessages);
router.put("/:id", protect, toggleMessageRead);
router.delete("/:id", protect, deleteMessage);

module.exports = router;
