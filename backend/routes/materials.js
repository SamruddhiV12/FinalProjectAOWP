const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getMaterials,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  trackDownload,
  upload,
  uploadMaterialFile,
} = require('../controllers/materialController');

// Get materials (students see their batch materials, admin sees all)
router.get('/', protect, getMaterials);

// Upload material (admin only)
router.post('/', protect, adminOnly, uploadMaterial);
// Upload file asset (admin only)
router.post('/upload', protect, adminOnly, upload.single('file'), uploadMaterialFile);

// Update material (admin only)
router.put('/:id', protect, adminOnly, updateMaterial);

// Delete material (admin only)
router.delete('/:id', protect, adminOnly, deleteMaterial);

// Track download
router.patch('/:id/download', protect, trackDownload);

module.exports = router;
