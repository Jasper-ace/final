// ============================================
// ENROLLMENT ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Create enrollment
router.post('/create', enrollmentController.createEnrollment);

// Get user enrollments
router.get('/user/:userId', enrollmentController.getUserEnrollments);

// Save account/billing info
router.post('/save-account', enrollmentController.saveAccountInfo);

module.exports = router;
