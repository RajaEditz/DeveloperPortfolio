const pool = require("../db");

// @desc    Get all messages (admin only)
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Messages Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Submit a message (Public - used by front-end contact form)
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Please include name, email, and message content." });
    }

    const result = await pool.query(
      `
      INSERT INTO messages 
      (name, email, subject, message, is_read, created_at) 
      VALUES ($1, $2, $3, $4, FALSE, NOW()) 
      RETURNING *
      `,
      [name, email, subject || "", message]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Message Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Mark message as read/unread (admin only)
// @route   PUT /api/messages/:id
// @access  Private
const toggleMessageRead = async (req, res) => {
  const { id } = req.params;
  const { is_read } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE messages 
      SET is_read = $1 
      WHERE id = $2 
      RETURNING *
      `,
      [is_read === true || is_read === "true", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Toggle Message Read Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a message (admin only)
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM messages WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully", messageDetails: result.rows[0] });
  } catch (error) {
    console.error("Delete Message Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getMessages,
  createMessage,
  toggleMessageRead,
  deleteMessage,
};
