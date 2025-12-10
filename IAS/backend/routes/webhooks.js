// ============================================
// WEBHOOK ROUTES (XENDIT)
// ============================================

const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// Xendit webhook endpoint
router.post('/xendit', webhookController.handleXenditWebhook);

module.exports = router;
