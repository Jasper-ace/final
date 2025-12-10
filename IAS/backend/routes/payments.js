// ============================================
// PAYMENT ROUTES (XENDIT)
// ============================================

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create invoice (supports all payment methods)
router.post('/create-invoice', paymentController.createInvoice);

// Create e-wallet charge (GCash, PayMaya, GrabPay)
router.post('/create-ewallet', paymentController.createEWalletCharge);

// Create virtual account
router.post('/create-virtual-account', paymentController.createVirtualAccount);

// Verify payment
router.get('/verify/:paymentId', paymentController.verifyPayment);

// Expire invoice
router.post('/expire/:invoiceId', paymentController.expireInvoice);

module.exports = router;
