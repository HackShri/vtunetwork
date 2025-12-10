// models/review.js
const { Schema } = require('mongoose');

function createReviewModel(conn) {
  const reviewSchema = new Schema({
    uploadId: { type: Schema.Types.ObjectId, required: true, index: true }, // id from uploads DB
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    reviewerName: { type: String },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    rating: { type: Number, required: true, min: 1, max: 5, index: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  }, { timestamps: true });

  reviewSchema.index({ uploadId: 1, createdAt: -1 }); // fetch recent reviews per upload
  reviewSchema.index({ userId: 1, uploadId: 1 }, { unique: true, sparse: true }); // optional: one-review-per-user-per-upload

  return conn.model('Review', reviewSchema);
}

module.exports = createReviewModel;
