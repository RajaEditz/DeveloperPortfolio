const multer = require("multer");

// Use memory storage to store file buffers before sending to Cloudinary
const storage = multer.memoryStorage();

// Allow images, PDFs, and Word documents
const fileFilter = (req, file, cb) => {
  // Accept only image MIME types for CV uploads
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only image files (JPG, JPEG, PNG, GIF, WEBP) are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit for CV images
  },
  fileFilter: fileFilter,
});

module.exports = upload;
