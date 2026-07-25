const jwt = require("jsonwebtoken");
const pool = require("../db");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from the database
      const result = await pool.query(
        "SELECT id, name, email FROM admins WHERE id = $1",
        [decoded.id]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.admin = result.rows[0];
      next();
    } catch (error) {
      console.error("JWT Verification Error:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
