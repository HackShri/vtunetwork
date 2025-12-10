const mongoose = require('mongoose');
const { config } = require('dotenv')

config();

const REVIEWS_DB_URI = process.env.MONGO_REVIEWS_URL || process.env.MONGO_URL;

let reviewsConn = null;

async function connectReviewDB() {
    if (reviewsConn && reviewsConn.readyState === 1) return reviewsConn;
    reviewsConn = await mongoose.createConnection(REVIEWS_DB_URI, {
        useNewUrlParser: true,
    });
    reviewsConn.on('connected', () => console.log('reviews db connected'));
    reviewsConn.on('error', (err) => console.log('reviews db error', err));
    return reviewsConn;
}
module.exports = connectReviewDB;