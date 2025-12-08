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

// Stats first to avoid catching "stats" as an ID
router.get('/stats', getStudentStats);       // current user stats
router.get('/:id/stats', getStudentStats);   // specific student stats

// Get student profile
router.get('/:id?', getStudentProfile);

// Update student profile
router.put('/:id?', updateStudentProfile);

module.exports = router;
