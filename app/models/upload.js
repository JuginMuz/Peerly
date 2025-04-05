const multer = require('multer');
const path = require('path');

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed.'), false);
  }
};

/* Storage for profile pictures:
   Filename: <user_id>_profile<extension>
   Assumes the route includes a user_id parameter.
*/
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const userId = req.params.user_id; // from route parameter
    const ext = path.extname(file.originalname);
    cb(null, `${userId}_profile${ext}`);
  }
});
const profileUpload = multer({ storage: profileStorage, fileFilter });

/* Storage for post images:
   Temporarily save file as: <user_id>_temp_<timestamp><extension>
   Later, you'll rename the file to include the post_id.
*/
const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    // Get user ID from session or from the request body (depending on your auth flow)
    const userId = req.session.user_id || req.body.user_id || 'unknown';
    const ext = path.extname(file.originalname);
    const tempName = `${userId}_temp_${Date.now()}${ext}`;
    cb(null, tempName);
  }
});
const postUpload = multer({ storage: postStorage, fileFilter });

module.exports = {
  profileUpload,
  postUpload
};
