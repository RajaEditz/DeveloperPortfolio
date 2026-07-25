const pool = require("../db");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM projects ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Projects Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Project By ID Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, technologies, github_url, live_url, featured } =
      req.body;

    let imageUrl = req.body.image_url || "";

    // Upload to Cloudinary if file exists in request
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "projects");
      imageUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      `
      INSERT INTO projects 
      (title, description, technologies, github_url, live_url, image_url, featured, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
      RETURNING *
      `,
      [
        title,
        description,
        technologies,
        github_url,
        live_url,
        imageUrl,
        featured === "true" || featured === true,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Project Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, description, technologies, github_url, live_url, featured } =
      req.body;

    // Check if project exists
    const checkProject = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id]
    );
    if (checkProject.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    let imageUrl = req.body.image_url || checkProject.rows[0].image_url;

    // If new file is uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "projects");
      imageUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      `
      UPDATE projects 
      SET title = $1, description = $2, technologies = $3, github_url = $4, live_url = $5, image_url = $6, featured = $7, updated_at = NOW() 
      WHERE id = $8 
      RETURNING *
      `,
      [
        title,
        description,
        technologies,
        github_url,
        live_url,
        imageUrl,
        featured === "true" || featured === true,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Project Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully", project: result.rows[0] });
  } catch (error) {
    console.error("Delete Project Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};