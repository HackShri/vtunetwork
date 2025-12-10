// models/ratingAggregate.js
const { Schema } = require('mongoose');

function createRatingAggregateModel(conn) {
    const aggSchema = new Schema({
        uploadId: { type: Schema.Types.ObjectId, required: true, unique: true, index: true },
        avgRating: { type: Number, default: 0, min: 0, max: 5 },
        ratingsCount: { type: Number, default: 0 },
        sumRatings: { type: Number, default: 0 }, // keep sum for incremental updates
        updatedAt: { type: Date, default: Date.now },
    }, { timestamps: true });

    aggSchema.index({ uploadId: 1 });

    return conn.model('RatingAggregate', aggSchema);
}

module.exports = createRatingAggregateModel;
