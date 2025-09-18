const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure the uploads folder exists
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// const checkFileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('pdf')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Not an pdf! Please upload only pdfs')); // Improved error message
//     }
// };

module.exports = multer({
  storage: storage,
  // fileFilter: checkFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limit file size to 50MB
  },
});
