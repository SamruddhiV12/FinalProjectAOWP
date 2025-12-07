const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceRecords,
  getAttendanceById,
  getStudentAttendanceSummary,
  getBatchAttendanceSummary,
} = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Summary routes (must be before /:id)
router.get('/student/:studentId/summary', getStudentAttendanceSummary);
router.get('/batch/:batchId/summary', getBatchAttendanceSummary);

// Attendance CRUD routes
router.post('/', markAttendance);
router.get('/', getAttendanceRecords);
router.get('/:id', getAttendanceById);

module.exports = router;
