const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth-middleware')
const {
    createReview,
    fetchReviews,
    editReview,
    deleteReview
} = require('../controllers/reviewsController')

// CREATE
router.post('/', auth, createReview)

// READ
router.get('/fetchReview/:id', fetchReviews)

// EDIT
router.put('/reviewEdit', auth, editReview)

// DELETE
router.delete('/:id', auth, deleteReview)

module.exports = router
