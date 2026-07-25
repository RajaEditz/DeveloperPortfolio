const pool = require("../db");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM certificates ORDER BY issue_date DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Certificates Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a certificate
// @route   POST /api/certificates
// @access  Private
const createCertificate = async (req, res) => {
  try {
    const { title, issuer, issue_date, credential_url } = req.body;
    let imageUrl = req.body.image_url || "";

    // Upload to Cloudinary if file exists
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "certificates");
      imageUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      `
      INSERT INTO certificates 
      (title, issuer, issue_date, credential_url, image_url, created_at) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING *
      `,
      [title, issuer, issue_date || null, credential_url, imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Certificate Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a certificate
// @route   PUT /api/certificates/:id
// @access  Private
const updateCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, issuer, issue_date, credential_url } = req.body;

    // Check exists
    const checkCertificate = await pool.query(
      "SELECT * FROM certificates WHERE id = $1",
      [id]
    );
    if (checkCertificate.rows.length === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    let imageUrl = req.body.image_url || checkCertificate.rows[0].image_url;

    // If new file is uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "certificates");
      imageUrl = uploadResult.secure_url;
    }

    const result = await pool.query(
      `
      UPDATE certificates 
      SET title = $1, issuer = $2, issue_date = $3, credential_url = $4, image_url = $5 
      WHERE id = $6 
      RETURNING *
      `,
      [title, issuer, issue_date || null, credential_url, imageUrl, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Certificate Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a certificate
// @route   DELETE /api/certificates/:id
// @access  Private
const deleteCertificate = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM certificates WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    res.json({ message: "Certificate deleted successfully", certificate: result.rows[0] });
  } catch (error) {
    console.error("Delete Certificate Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
