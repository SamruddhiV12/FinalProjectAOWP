const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getStudentProfile,
  updateStudentProfile,
  getStudentStats,
} = require('../controllers/studentProfileController');

// All routes are protected
router.use(protect);

// Get student profile and stats
router.get('/:id?', getStudentProfile);
router.get('/:id/stats', getStudentStats);

// Update student profile
router.put('/:id?', updateStudentProfile);

module.exports = router;
