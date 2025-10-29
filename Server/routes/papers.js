const express = require('express');
const router = express.Router();
const Upload = require('../models/pdf');

// Get all question papers
router.get('/papers', async (req, res) => {
    try {
        const papers = await Upload.find({ type: 'questionpaper' }).lean();
        res.status(200).json({
            success: true,
            data: papers
        });
    } catch (error) {
        console.error('Error fetching papers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

// Get filtered question papers
router.get('/papers/filter', async (req, res) => {
    const { branch, semester, subjectCode, subjectName } = req.query;
    const filters = { type: 'questionpaper' };

    if (branch) filters.branch = branch;
    if (semester) filters.semester = semester;
    if (subjectCode) filters.subjectCode = subjectCode;
    if (subjectName) filters.subjectName = subjectName;

    try {
        const papers = await Upload.find(filters).lean();
        res.status(200).json({
            success: true,
            data: papers
        });
    } catch (error) {
        console.error('Error filtering papers:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

module.exports = router;
