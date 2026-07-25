const pool = require("../db");
const { uploadToCloudinary } = require("../config/cloudinary");

// Optimize Cloudinary URL by inserting transformation parameters
const optimizeCloudinaryUrl = (url) => {
  if (!url) return "";
  // Check if it's a Cloudinary URL
  if (url.includes("res.cloudinary.com")) {
    return url.replace("/upload/", "/upload/c_fill,g_auto,w_500,h_500,q_auto,f_auto/");
  }
  return url;
};

// @desc    Get profile photo
// @route   GET /api/profile-photo
// @access  Public
const getProfilePhoto = async (req, res) => {
  try {
    const result = await pool.query("SELECT profile_photo FROM contact_info LIMIT 1");
    if (result.rows.length === 0) {
      return res.json({ profile_photo: null });
    }
    return res.json({ profile_photo: result.rows[0].profile_photo || null });
  } catch (error) {
    console.error("Get Profile Photo Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Upload/Update profile photo
// @route   PUT /api/profile-photo
// @access  Private
const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed."
      });
    }

    // Validate size (5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (req.file.size > maxSizeBytes) {
      return res.status(400).json({
        message: "File size exceeds 5MB limit."
      });
    }

    // Upload to Cloudinary under folder 'portfolio/profile'
    const uploadResult = await uploadToCloudinary(req.file.buffer, "portfolio/profile", "image");
    
    // Apply Cloudinary transformation optimizations
    const secureUrl = optimizeCloudinaryUrl(uploadResult.secure_url);

    // Upsert database record
    const checkContact = await pool.query("SELECT * FROM contact_info LIMIT 1");
    const hasRecord = checkContact.rows.length > 0;
    
    let result;
    if (hasRecord) {
      const id = checkContact.rows[0].id;
      result = await pool.query(
        "UPDATE contact_info SET profile_photo = $1 WHERE id = $2 RETURNING profile_photo",
        [secureUrl, id]
      );
    } else {
      result = await pool.query(
        "INSERT INTO contact_info (profile_photo) VALUES ($1) RETURNING profile_photo",
        [secureUrl]
      );
    }

    return res.json({ profile_photo: result.rows[0].profile_photo });
  } catch (error) {
    console.error("Update Profile Photo Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete profile photo
// @route   DELETE /api/profile-photo
// @access  Private
const deleteProfilePhoto = async (req, res) => {
  try {
    const checkContact = await pool.query("SELECT * FROM contact_info LIMIT 1");
    if (checkContact.rows.length > 0) {
      const id = checkContact.rows[0].id;
      await pool.query("UPDATE contact_info SET profile_photo = NULL WHERE id = $1", [id]);
    }
    return res.json({ message: "Profile photo removed successfully", profile_photo: null });
  } catch (error) {
    console.error("Delete Profile Photo Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProfilePhoto,
  updateProfilePhoto,
  deleteProfilePhoto,
};
