const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  getStudentStats,
  updateStudent,
} = require('../controllers/studentController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// GET /api/students/stats - Get statistics
router.get('/stats', getStudentStats);

// GET /api/students - Get all students (with filters)
router.get('/', getAllStudents);

// GET /api/students/:id - Get single student
router.get('/:id', getStudentById);

// PUT /api/students/:id - Update student
router.put('/:id', updateStudent);

module.exports = router;
