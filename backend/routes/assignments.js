const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
  getAssignmentSubmissions,
  getPendingReviewCount
} = require('../controllers/assignmentController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Pending review count (admin)
router.get('/pending/reviews', adminOnly, getPendingReviewCount);

// Public routes (both students and admin)
router.get('/', getAssignments);
router.get('/:id', getAssignmentById);

// Student routes
router.post('/:id/submit', submitAssignment);

// Admin only routes
router.post('/', adminOnly, createAssignment);
router.put('/:id', adminOnly, updateAssignment);
router.delete('/:id', adminOnly, deleteAssignment);
router.get('/:id/submissions', adminOnly, getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', adminOnly, gradeSubmission);

module.exports = router;
