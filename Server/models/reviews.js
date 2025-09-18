const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    uploadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Upload', // reference to the Upload model (PDF)
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // optional: reference to a User
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // assuming 5-star rating system
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    reviewerName: {
        type: String,
        required: false
    },


}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review