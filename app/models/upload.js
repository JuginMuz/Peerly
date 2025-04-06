// Import multer to handle file uploads and path to manage file paths.
const multer = require('multer');
const path = require('path');

// File filter function to only allow image files during upload.
const fileFilter = (req, file, cb) => {
  // Check if the file's MIME type starts with 'image/'.
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file if it's an image.
  } else {
    // Reject the file and return an error if it's not an image.
    cb(new Error('Only image files are allowed.'), false);
  }
};

/* 
   Storage configuration for profile pictures.
   The file will be saved with the format: <user_id>_profile<extension>.
   This setup assumes that the route includes a user_id parameter.
*/
const profileStorage = multer.diskStorage({
  // Set the destination folder for uploaded profile pictures.
  destination: function (req, file, cb) {
    // Save files in the public/images directory.
    cb(null, path.join(__dirname, '../public/images'));
  },
  // Define how to name the uploaded file.
  filename: function (req, file, cb) {
    // Retrieve the user ID from the route parameters.
    const userId = req.params.user_id;
    // Extract the file extension from the original file name.
    const ext = path.extname(file.originalname);
    // Create a file name using the user ID and append '_profile' before the extension.
    cb(null, `${userId}_profile${ext}`);
  }
});

// Create a multer instance for profile picture uploads using the defined storage and file filter.
const profileUpload = multer({ storage: profileStorage, fileFilter });

/*
   Storage configuration for post images.
   The file is temporarily saved with the format: <user_id>_temp_<timestamp><extension>.
   Later, the file name will be changed to include the actual post_id.
*/
const postStorage = multer.diskStorage({
  // Set the destination folder for uploaded post images.
  destination: function (req, file, cb) {
    // Save files in the public/images directory.
    cb(null, path.join(__dirname, '../public/images'));
  },
  // Define how to name the uploaded file.
  filename: function (req, file, cb) {
    // Get the user ID from the session or request body; default to 'unknown' if not available.
    const userId = req.session.user_id || req.body.user_id || 'unknown';
    // Extract the file extension from the original file name.
    const ext = path.extname(file.originalname);
    // Create a temporary file name with the current timestamp.
    const tempName = `${userId}_temp_${Date.now()}${ext}`;
    cb(null, tempName);
  }
});

// Create a multer instance for post image uploads using the defined storage and file filter.
const postUpload = multer({ storage: postStorage, fileFilter });

// Export the profile and post upload handlers so they can be used in routes.
module.exports = {
  profileUpload,
  postUpload
};
