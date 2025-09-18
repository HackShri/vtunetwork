const mongoose = require('mongoose');
const cloudUploadSchema = new mongoose.Schema(
  {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    normal_url: { type: String },
    original_filename: { type: String },
    asset_id: { type: String },
  },
  { _id: false },
); // prevent auto _id in sub-documents

const uploadSchema = new mongoose.Schema(
  {
    clouduploads: {
      type: [cloudUploadSchema],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    subjectCode: { type: String }, // required: true },
    subjectName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    uploaderName: { type: String, required: true },
    uploaderEmail: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    tags: { type: [String], default: [] },
    fileType: { type: String, default: 'pdf' },
    isApproved: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    downloadsCount: { type: Number, default: 0 },
    previewImageUrl: { type: String },
    folder: { type: String, default: 'pdfFiles' },
  },
  { timestamps: true },
);

const Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;
