const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { upsertPayment, getPayments, updatePayment, getSummary, getBatchMonthView } = require('../controllers/paymentController');

// Create or update (upsert) a payment for a given student/month
router.post('/', protect, adminOnly, upsertPayment);

// Get payments (admins can filter; students see own)
router.get('/', protect, getPayments);

// Batch + month view (students within batch with statuses)
router.get('/batch-view', protect, adminOnly, getBatchMonthView);

// Summary for dashboard
router.get('/summary', protect, adminOnly, getSummary);

// Update an existing payment
router.put('/:id', protect, adminOnly, updatePayment);

module.exports = router;
