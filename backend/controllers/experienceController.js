const pool = require("../db");

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
const getExperiences = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM experiences ORDER BY start_date DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Experiences Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create an experience
// @route   POST /api/experiences
// @access  Private
const createExperience = async (req, res) => {
  try {
    const {
      role,
      company,
      location,
      start_date,
      end_date,
      currently_working,
      description,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO experiences 
      (role, company, location, start_date, end_date, currently_working, description, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING *
      `,
      [
        role,
        company,
        location,
        start_date || null,
        end_date || null,
        currently_working === "true" || currently_working === true,
        description,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Experience Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update an experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = async (req, res) => {
  const { id } = req.params;
  try {
    const {
      role,
      company,
      location,
      start_date,
      end_date,
      currently_working,
      description,
    } = req.body;

    // Check exists
    const checkExp = await pool.query(
      "SELECT * FROM experiences WHERE id = $1",
      [id]
    );
    if (checkExp.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const result = await pool.query(
      `
      UPDATE experiences 
      SET role = $1, company = $2, location = $3, start_date = $4, end_date = $5, currently_working = $6, description = $7 
      WHERE id = $8 
      RETURNING *
      `,
      [
        role,
        company,
        location,
        start_date || null,
        end_date || null,
        currently_working === "true" || currently_working === true,
        description,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Experience Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete an experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM experiences WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json({ message: "Experience deleted successfully", experience: result.rows[0] });
  } catch (error) {
    console.error("Delete Experience Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
