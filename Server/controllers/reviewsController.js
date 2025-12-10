// controllers/reviewsController.js
const mongoose = require('mongoose');
const connectReviewsDB = require('../config/reviewsDb');
const createReviewModel = require('../models/review');
const createRatingAggregateModel = require('../models/ratingAggregate');

// lazy models
let Review, RatingAggregate;
async function ensureModels() {
  if (Review && RatingAggregate) return { Review, RatingAggregate };
  const conn = await connectReviewsDB();
  Review = createReviewModel(conn);
  RatingAggregate = createRatingAggregateModel(conn);
  return { Review, RatingAggregate };
}

/**
 * Helper: recalc or incrementally update aggregate
 * - on create: increment sum & count -> avg
 * - on edit: adjust sum by diff -> avg
 * - on delete: decrement sum & count -> avg
 */
async function updateAggregateOnCreate(uploadId, rating) {
  const { RatingAggregate } = await ensureModels();
  const res = await RatingAggregate.findOneAndUpdate(
    { uploadId },
    {
      $inc: { ratingsCount: 1, sumRatings: rating },
      $set: { updatedAt: new Date() }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.avgRating = res.ratingsCount ? res.sumRatings / res.ratingsCount : 0;
  await res.save();
  return res;
}

async function updateAggregateOnEdit(uploadId, oldRating, newRating) {
  const { RatingAggregate } = await ensureModels();
  const res = await RatingAggregate.findOneAndUpdate(
    { uploadId },
    {
      $inc: { sumRatings: (newRating - oldRating) },
      $set: { updatedAt: new Date() }
    },
    { new: true }
  );
  if (!res) throw new Error('Aggregate doc not found');
  res.avgRating = res.ratingsCount ? res.sumRatings / res.ratingsCount : 0;
  await res.save();
  return res;
}

async function updateAggregateOnDelete(uploadId, rating) {
  const { RatingAggregate } = await ensureModels();
  const res = await RatingAggregate.findOne({ uploadId });
  if (!res) return null;
  res.ratingsCount = Math.max(0, res.ratingsCount - 1);
  res.sumRatings = Math.max(0, res.sumRatings - rating);
  res.avgRating = res.ratingsCount ? res.sumRatings / res.ratingsCount : 0;
  res.updatedAt = new Date();
  await res.save();
  return res;
}

/* Helper function to extract userId from different auth sources */
function getUserId(req) {
  // Try JWT token format first (has userID)
  if (req.user && req.user.userID) return req.user.userID.toString();
  if (req.userInfo && req.userInfo.userID) return req.userInfo.userID.toString();
  
  // Try Passport.js format (has _id)
  if (req.user && req.user._id) return req.user._id.toString();
  if (req.userInfo && req.userInfo._id) return req.userInfo._id.toString();
  
  return null;
}

/* Controller actions */

async function createReview(req, res) {
  try {
    const { id: uploadId, content, rating } = req.body;
    if (!uploadId || !content || !rating) return res.status(400).json({ success: false, message: 'Missing fields' });

    const userId = getUserId(req);
    console.log('createReview - userId:', userId, 'req.user:', req.user, 'req.userInfo:', req.userInfo);
    if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

    const { Review } = await ensureModels();

    // If you enforced unique user-upload, this will error if duplicate.
    const doc = await Review.create({
      uploadId,
      userId,
      reviewerName: req.user?.username || req.userInfo?.username || 'Anonymous',
      content,
      rating
    });

    // update aggregate
    const agg = await updateAggregateOnCreate(uploadId, rating);

    return res.status(201).json({ success: true, review: doc, aggregate: agg });
  } catch (err) {
    console.error('createReview error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function fetchReviews(req, res) {
  try {
    const { id: uploadId } = req.params;
    const { Review, RatingAggregate } = await ensureModels();
    const reviews = await Review.find({ uploadId }).sort({ createdAt: -1 }).lean();
    const agg = await RatingAggregate.findOne({ uploadId }).lean();
    return res.status(200).json({ success: true, data: reviews, aggregate: agg || { avgRating: 0, ratingsCount: 0 } });
  } catch (err) {
    console.error('fetchReviews error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function editReview(req, res) {
  try {
    const { reviewId, content, rating } = req.body;
    if (!reviewId || !content || !rating) return res.status(400).json({ success: false, message: 'Missing fields' });

    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

    const { Review } = await ensureModels();
    const existing = await Review.findById(reviewId);
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found' });
    if (existing.userId.toString() !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    const oldRating = existing.rating;
    existing.content = content;
    existing.rating = rating;
    existing.updatedAt = Date.now();
    await existing.save();

    // update aggregate
    const agg = await updateAggregateOnEdit(existing.uploadId, oldRating, rating);

    return res.status(200).json({ success: true, review: existing, aggregate: agg });
  } catch (err) {
    console.error('editReview error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, message: 'Login required' });

    const { Review } = await ensureModels();
    const existing = await Review.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Review not found' });
    if (existing.userId.toString() !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    const rating = existing.rating;
    const uploadId = existing.uploadId;

    await Review.deleteOne({ _id: id });
    const agg = await updateAggregateOnDelete(uploadId, rating);

    return res.status(200).json({ success: true, message: 'Deleted', aggregate: agg });
  } catch (err) {
    console.error('deleteReview error', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { createReview, fetchReviews, editReview, deleteReview };
