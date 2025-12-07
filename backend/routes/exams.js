const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStudentExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamStats,
} = require('../controllers/examController');

// All routes are protected
router.use(protect);

// Student/Admin routes
router.get('/', getStudentExams);
router.get('/stats/:studentId?', getExamStats);
router.get('/:id', getExamById);

// Admin only routes
router.post('/', authorize('admin'), createExam);
router.put('/:id', authorize('admin'), updateExam);
router.delete('/:id', authorize('admin'), deleteExam);

module.exports = router;
