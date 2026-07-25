const pool = require("../db");
const { uploadToCloudinary } = require("../config/cloudinary");

// @desc    Get contact info
// @route   GET /api/contact
// @access  Public
const getContactInfo = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contact_info LIMIT 1");
    if (result.rows.length === 0) {
      // Return empty object/structure if no contact info exists yet
      return res.json({});
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get Contact Info Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update contact info
// @route   PUT /api/contact
// @access  Private
const updateContactInfo = async (req, res) => {
  try {
    const { phone, email, linkedin, github, portfolio, location } = req.body;

    // Check if there is an existing record
    const checkContact = await pool.query("SELECT * FROM contact_info LIMIT 1");
    let resumeUrl = req.body.resume_url || "";
    const hasRecord = checkContact.rows.length > 0;

    if (hasRecord) {
      resumeUrl = req.body.resume_url || checkContact.rows[0].resume_url;
    }

    // Upload new resume file (PDF/Word/etc.) to Cloudinary if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "resumes");
      resumeUrl = uploadResult.secure_url;
    }

    let result;

    if (hasRecord) {
      // Update existing record
      const id = checkContact.rows[0].id;
      result = await pool.query(
        `
        UPDATE contact_info 
        SET phone = $1, email = $2, linkedin = $3, github = $4, portfolio = $5, resume_url = $6, location = $7 
        WHERE id = $8 
        RETURNING *
        `,
        [phone, email, linkedin, github, portfolio, resumeUrl, location, id]
      );
    } else {
      // Insert new record
      result = await pool.query(
        `
        INSERT INTO contact_info 
        (phone, email, linkedin, github, portfolio, resume_url, location) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *
        `,
        [phone, email, linkedin, github, portfolio, resumeUrl, location]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Contact Info Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo,
};
