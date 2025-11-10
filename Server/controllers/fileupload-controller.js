const Upload = require('../models/pdf');

async function fileUpload(req, res) {
  const {
    clouduploads,
    branch,
    semester,
    title,
    type,
    tags,
    description,
    uploaderEmail,
    uploaderName,
    subjectCode,
    subjectName,
  } = req.body;
  if (!req.body.type) req.body.type = 'notes';

  try {
    let userUpload = await Upload.create({
      clouduploads: clouduploads,
      branch: branch,
      semester: semester,
      title: title,
      type: req.body.type || 'notes',
      description: description,
      uploaderEmail: uploaderEmail,
      uploaderName: uploaderName,
      subjectName: subjectName,
      subjectCode: subjectCode,
      tags: tags,
    });
    const data = await userUpload.save();
    console.log(data);
    if (data) {
      return res.status(202).json({
        success: true,
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function fileReturn(req, res) {
  // Get all query parameters
  let { branch, semester, subject, subjectName, subjectCode, type } = req.query;
  const filters = {};

  // Add basic filters
  if (branch) filters.branch = branch;
  if (semester) filters.semester = semester;
  if (type) filters.type = type; // 'questionpaper' or 'notes'  // Handle subject filtering with priority
  if (subjectCode) {
    filters.subjectCode = subjectCode;
  } else if (subjectName) {
    filters.subjectName = subjectName;
  } else if (subject) {
    // If subject is provided, check if it looks like a code
    const looksLikeCode = /^[A-Za-z]{2,}\d{2,}/.test(subject);
    if (looksLikeCode) {
      filters.subjectCode = subject;
    } else {
      filters.subjectName = subject;
    }
  }

  try {
    const responses = await Upload.find(filters).lean();
    // Always return an array (empty when nothing found)
    return res.status(200).json({
      data: Array.isArray(responses) ? responses : [],
      message: 'The pdfs are successfully fetched',
      success: true,
    });
  } catch (error) {
    console.error('fileReturn error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'There is internal Server Error',
      error: error.message,
    });
  }
}
async function fetchSinglepdf(req, res) {
  let { id } = req.params;

  try {
    let responses = await Upload.find({ _id: id });

    if (responses && responses.length > 0) {
      return res.json({
        data: responses,
        message: 'The pdf is successfully fetched',
        success: true,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'PDF not found',
      });
    }
  } catch (error) {
    console.error('Database error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'There is internal Server Error',
      error: error.message,
    });
  }
}

async function filterPdfs(req, res) {
  // Backwards-compatible filter: accept subjectName / subjectCode / subject
  let { semester, branch, subject, subjectName, subjectCode } = req.query;
  const filter = {};
  if (semester) filter.semester = semester;
  if (branch) filter.branch = branch;

  if (subjectCode) filter.subjectCode = subjectCode;
  else if (subjectName) filter.subjectName = subjectName;
  else if (subject) {
    const looksLikeCode = /^[A-Za-z]{2,}\d{2,}/.test(subject);
    if (looksLikeCode) filter.subjectCode = subject;
    else filter.subjectName = subject;
  }

  try {
    const data = await Upload.find(filter).lean();
    return res.status(200).json({
      data: Array.isArray(data) ? data : [],
      success: true,
      message: 'The elements are fetched based on the filter',
    });
  } catch (error) {
    console.error('filterPdfs error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

module.exports = { filterPdfs, fileUpload, fileReturn, fetchSinglepdf };
