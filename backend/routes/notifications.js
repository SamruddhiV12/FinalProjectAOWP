const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  sendPaymentReminder,
} = require('../controllers/notificationController');
const { getSentNotifications } = require('../controllers/notificationController');

router.get('/', protect, getNotifications);
router.get('/sent', protect, adminOnly, getSentNotifications);
router.post('/', protect, adminOnly, createNotification);
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);
router.post('/payment-reminder', protect, adminOnly, sendPaymentReminder);

module.exports = router;
