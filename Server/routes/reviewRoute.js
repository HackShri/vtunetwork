const { uploadReview, fetchReviews, editReview, deleteReviews } = require('../controllers/review-controller')

const express = require('express')
const router = express.Router(

)

router.post('/reviews', uploadReview)
router.get('/fetchReview/:id', fetchReviews)
router.delete('/deleteReview/:id', deleteReviews)
router.put('/reviewEdit', editReview)

module.exports = router