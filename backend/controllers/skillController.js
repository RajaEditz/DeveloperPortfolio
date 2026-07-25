const pool = require("../db");

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM skills ORDER BY category, proficiency DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Skills Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    const { category, skill_name, proficiency } = req.body;

    const result = await pool.query(
      `
      INSERT INTO skills 
      (category, skill_name, proficiency, created_at) 
      VALUES ($1, $2, $3, NOW()) 
      RETURNING *
      `,
      [category, skill_name, parseInt(proficiency) || 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Skill Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const { category, skill_name, proficiency } = req.body;

    // Check exists
    const checkSkill = await pool.query("SELECT * FROM skills WHERE id = $1", [
      id,
    ]);
    if (checkSkill.rows.length === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const result = await pool.query(
      `
      UPDATE skills 
      SET category = $1, skill_name = $2, proficiency = $3 
      WHERE id = $4 
      RETURNING *
      `,
      [category, skill_name, parseInt(proficiency) || 0, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Skill Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM skills WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Skill not found" });
    }
    res.json({ message: "Skill deleted successfully", skill: result.rows[0] });
  } catch (error) {
    console.error("Delete Skill Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
};
