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
    const { title, description, technologies, github_url, live_url, featured, features } =
      req.body;

    let imageUrls = [];
    if (req.body.image_urls) {
      try {
        imageUrls = typeof req.body.image_urls === "string" ? JSON.parse(req.body.image_urls) : req.body.image_urls;
      } catch (e) {
        console.error("Error parsing image_urls:", e);
      }
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
      } catch (e) {
        console.error("Error parsing features:", e);
      }
    }

    // Upload to Cloudinary if files exist in request
    let thumbnailUrl = "";
    if (req.files && req.files["thumbnail"] && req.files["thumbnail"].length > 0) {
      const thumbnailFile = req.files["thumbnail"][0];
      const uploadResult = await uploadToCloudinary(thumbnailFile.buffer, "projects");
      thumbnailUrl = uploadResult.secure_url;
    }

    if (req.files && req.files["images"] && req.files["images"].length > 0) {
      const uploadPromises = req.files["images"].map((file) =>
        uploadToCloudinary(file.buffer, "projects")
      );
      const uploadResults = await Promise.all(uploadPromises);
      const newUrls = uploadResults.map((r) => r.secure_url);
      imageUrls = [...imageUrls, ...newUrls];
    }

    const imageUrl = imageUrls.length > 0 ? imageUrls[0] : "";

    const result = await pool.query(
      `
      INSERT INTO projects 
      (title, description, technologies, github_url, live_url, image_url, image_urls, featured, features, thumbnail_url, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
      RETURNING *
      `,
      [
        title,
        description,
        technologies,
        github_url,
        live_url,
        imageUrl,
        imageUrls,
        featured === "true" || featured === true,
        parsedFeatures,
        thumbnailUrl,
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
    const { title, description, technologies, github_url, live_url, featured, features } =
      req.body;

    // Check if project exists
    const checkProject = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id]
    );
    if (checkProject.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    let imageUrls = [];
    if (req.body.image_urls) {
      try {
        imageUrls = typeof req.body.image_urls === "string" ? JSON.parse(req.body.image_urls) : req.body.image_urls;
      } catch (e) {
        console.error("Error parsing image_urls:", e);
      }
    } else {
      imageUrls = checkProject.rows[0].image_urls || (checkProject.rows[0].image_url ? [checkProject.rows[0].image_url] : []);
    }

    let parsedFeatures = [];
    if (features) {
      try {
        parsedFeatures = typeof features === "string" ? JSON.parse(features) : features;
      } catch (e) {
        console.error("Error parsing features:", e);
      }
    } else {
      parsedFeatures = checkProject.rows[0].features || [];
    }

    let thumbnailUrl = req.body.thumbnail_url;
    if (req.files && req.files["thumbnail"] && req.files["thumbnail"].length > 0) {
      const thumbnailFile = req.files["thumbnail"][0];
      const uploadResult = await uploadToCloudinary(thumbnailFile.buffer, "projects");
      thumbnailUrl = uploadResult.secure_url;
    } else if (thumbnailUrl === undefined || thumbnailUrl === null) {
      thumbnailUrl = checkProject.rows[0].thumbnail_url || "";
    }

    // If new gallery files are uploaded
    if (req.files && req.files["images"] && req.files["images"].length > 0) {
      const uploadPromises = req.files["images"].map((file) =>
        uploadToCloudinary(file.buffer, "projects")
      );
      const uploadResults = await Promise.all(uploadPromises);
      const newUrls = uploadResults.map((r) => r.secure_url);
      imageUrls = [...imageUrls, ...newUrls];
    }

    const imageUrl = imageUrls.length > 0 ? imageUrls[0] : "";

    const result = await pool.query(
      `
      UPDATE projects 
      SET title = $1, description = $2, technologies = $3, github_url = $4, live_url = $5, image_url = $6, image_urls = $7, featured = $8, features = $9, thumbnail_url = $10, updated_at = NOW() 
      WHERE id = $11 
      RETURNING *
      `,
      [
        title,
        description,
        technologies,
        github_url,
        live_url,
        imageUrl,
        imageUrls,
        featured === "true" || featured === true,
        parsedFeatures,
        thumbnailUrl,
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