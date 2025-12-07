const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  togglePublish,
} = require('../controllers/classScheduleController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Schedule CRUD routes
router.post('/', createSchedule);
router.get('/', getSchedules);
router.get('/:id', getScheduleById);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

// Publish/Unpublish
router.patch('/:id/publish', togglePublish);

module.exports = router;
