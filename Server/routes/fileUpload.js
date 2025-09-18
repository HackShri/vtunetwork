const e = require('express');
const {
  fileUpload,
  fileReturn,
  filterPdfs,
  fetchSinglepdf,
} = require('../controllers/fileupload-controller');
const uploadMiddleware = require('../middleware/upload-middleware');
const router = e.Router();

router.post('/metaUploads', fileUpload);
router.get('/fetchPdfs', fileReturn);
router.get('/fetchPdf/:id', fetchSinglepdf);
router.get('/filter', filterPdfs);
// router.post('/deleteUploads', delete)
module.exports = router;
