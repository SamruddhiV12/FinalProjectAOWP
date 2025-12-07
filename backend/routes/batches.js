const express = require('express');
const router = express.Router();
const {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  addStudentToBatch,
  removeStudentFromBatch,
  getBatchStats,
} = require('../controllers/batchController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Stats route (must be before /:id)
router.get('/stats', adminOnly, getBatchStats);

// Batch CRUD routes
router.post('/', adminOnly, createBatch);
router.get('/', getAllBatches);
router.get('/:id', getBatchById);
router.put('/:id', adminOnly, updateBatch);

// Student management in batch
router.post('/:id/students', adminOnly, addStudentToBatch);
router.delete('/:id/students/:studentId', adminOnly, removeStudentFromBatch);

module.exports = router;
