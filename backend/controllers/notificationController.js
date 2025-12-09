const Notification = require('../models/Notification');
const Batch = require('../models/Batch');

const createNotificationsForUsers = async ({ userIds, type, title, message, meta, createdBy }) => {
  const docs = userIds.map((id) => ({
    user: id,
    type,
    title,
    message,
    meta: meta || {},
    createdBy,
  }));
  if (!docs.length) return [];
  return Notification.insertMany(docs);
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching notifications' });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userIds = [], type = 'general', title, message, meta = {} } = req.body;
    if (!title || !message || !Array.isArray(userIds) || !userIds.length) {
      return res.status(400).json({ success: false, message: 'userIds, title, and message are required' });
    }
    const created = await createNotificationsForUsers({
      userIds,
      type,
      title,
      message,
      meta,
      createdBy: req.user._id,
    });
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Create Notification Error:', error);
    return res.status(500).json({ success: false, message: 'Error creating notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Mark Read Error:', error);
    return res.status(500).json({ success: false, message: 'Error updating notification' });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark All Read Error:', error);
    return res.status(500).json({ success: false, message: 'Error updating notifications' });
  }
};

const sendPaymentReminder = async (req, res) => {
  try {
    const { batchId, studentIds = [], monthLabel, amount } = req.body;
    if (!batchId || !monthLabel) {
      return res.status(400).json({ success: false, message: 'batchId and monthLabel are required' });
    }
    const batch = await Batch.findById(batchId).populate('students', '_id firstName lastName');
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const targets = studentIds.length
      ? batch.students.filter((s) => studentIds.includes(s._id.toString()))
      : batch.students;

    const title = 'Payment Reminder';
    const message = `Your payment for ${monthLabel} is pending. Amount: ₹${amount || batch.monthlyFee || ''}`;

    const created = await createNotificationsForUsers({
      userIds: targets.map((s) => s._id),
      type: 'payment_reminder',
      title,
      message,
      meta: { batchId, monthLabel, amount: amount || batch.monthlyFee },
      createdBy: req.user._id,
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('Payment Reminder Error:', error);
    return res.status(500).json({ success: false, message: 'Error sending reminders' });
  }
};

const getSentNotifications = async (req, res) => {
  try {
    const sent = await Notification.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.status(200).json({ success: true, data: sent });
  } catch (error) {
    console.error('Get Sent Notifications Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching sent notifications' });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  sendPaymentReminder,
  getSentNotifications,
  createNotificationsForUsers,
};
