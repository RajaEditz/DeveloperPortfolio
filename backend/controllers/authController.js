const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public (Can be restricted/disabled after first registration)
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    // Check if email already exists
    const checkUser = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user in DB
    const result = await pool.query(
      "INSERT INTO admins (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, name, email, created_at",
      [name, email, hashedPassword]
    );

    const admin = result.rows[0];

    res.status(201).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } catch (error) {
    console.error("Register Admin Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Authenticate admin & get token
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    // Fetch user
    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const admin = result.rows[0];

    // Check password matches
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } catch (error) {
    console.error("Login Admin Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.admin is set by protect middleware
  res.json(req.admin);
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
};
