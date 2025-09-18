const Upload = require('../models/pdf');
const Review = require('../models/reviews');

const uploadReview = async (req, res) => {
  let { id, user_id, reviewerName, content, rating } = req.body;
  let data = await Review.create({
    uploadId: id,
    userId: user_id,
    content: content,
    rating: rating,
    reviewerName: reviewerName,
  });
  if (data) {
    return res.status(200).json({
      success: true,
      data: data,
    });
  }
};

const fetchReviews = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    let response = await Review.find({ uploadId: id });
    if (response) {
      return res.status(202).json({
        success: true,
        data: response,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(504).json({
      message: error.message,
      success: false,
    });
  }
};
const deleteReviews = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    let response = await Review.deleteOne({ _id: id });
    console.log(response);
    if (response) {
      return res.status(202).json({
        success: true,
        message: 'The  review is successfully deleted ',
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
const editReview = async (req, res) => {
  console.log(req.body);
  let { reviewId, content, rating } = req.body;
  try {
    let response = await Review.updateOne(
      { _id: reviewId },
      {
        $set: {
          content: content,
          rating: rating,
        },
      },
    );
    console.log(response);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { uploadReview, deleteReviews, fetchReviews, editReview };
