const pool = require("../db");

// @desc    Get all publications
// @route   GET /api/publications
// @access  Public
const getPublications = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM publications ORDER BY publication_date DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Publications Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a publication
// @route   POST /api/publications
// @access  Private
const createPublication = async (req, res) => {
  try {
    const { title, authors, journal, publication_date, doi, citation, abstract } =
      req.body;

    const result = await pool.query(
      `
      INSERT INTO publications 
      (title, authors, journal, publication_date, doi, citation, abstract, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING *
      `,
      [
        title,
        authors,
        journal,
        publication_date || null,
        doi,
        citation,
        abstract,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Publication Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a publication
// @route   PUT /api/publications/:id
// @access  Private
const updatePublication = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, authors, journal, publication_date, doi, citation, abstract } =
      req.body;

    // Check exists
    const checkPub = await pool.query(
      "SELECT * FROM publications WHERE id = $1",
      [id]
    );
    if (checkPub.rows.length === 0) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const result = await pool.query(
      `
      UPDATE publications 
      SET title = $1, authors = $2, journal = $3, publication_date = $4, doi = $5, citation = $6, abstract = $7 
      WHERE id = $8 
      RETURNING *
      `,
      [
        title,
        authors,
        journal,
        publication_date || null,
        doi,
        citation,
        abstract,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Publication Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a publication
// @route   DELETE /api/publications/:id
// @access  Private
const deletePublication = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM publications WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Publication not found" });
    }
    res.json({ message: "Publication deleted successfully", publication: result.rows[0] });
  } catch (error) {
    console.error("Delete Publication Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
};
