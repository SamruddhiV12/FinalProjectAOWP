const Material = require('../models/Material');
const Batch = require('../models/Batch');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const isVercel = !!process.env.VERCEL;
const uploadDir = isVercel
  ? path.join('/tmp', 'uploads', 'materials')
  : path.join(__dirname, '..', 'uploads', 'materials');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '-');
    const unique = `${Date.now()}-${safeName}`;
    cb(null, unique);
  }
});

const upload = multer({ storage });

const getMaterials = async (req, res) => {
  try {
    const user = req.user;
    let materials;

    if (user.role === 'admin') {
      // Admin sees all materials
      materials = await Material.find()
        .populate('batches', 'name level')
        .populate('uploadedBy', 'firstName lastName')
        .sort({ createdAt: -1 });
    } else {
      // Students see only materials for their batches or public materials
      const studentBatches = await Batch.find({ students: user._id }).select('_id');
      const batchIds = studentBatches.map((b) => b._id);

      materials = await Material.find({
        $or: [{ batches: { $in: batchIds } }, { isPublic: true }],
      })
        .populate('batches', 'name level')
        .populate('uploadedBy', 'firstName lastName')
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      data: materials,
    });
  } catch (error) {
    console.error('Get Materials Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching materials',
    });
  }
};

const uploadMaterial = async (req, res) => {
  try {
    const { title, description, category, fileUrl, fileName, fileType, fileSize, batchIds, isPublic } = req.body;

    if (!title || !fileUrl || !fileName || !fileType) {
      return res.status(400).json({
        success: false,
        message: 'Title, file URL, file name, and file type are required',
      });
    }

    // Validate batches if provided
    let validBatchIds = [];
    if (batchIds && batchIds.length > 0) {
      const batches = await Batch.find({ _id: { $in: batchIds } });
      validBatchIds = batches.map((b) => b._id);
    }

    const material = await Material.create({
      title,
      description: description || '',
      category: category || 'Theory',
      fileUrl,
      fileName,
      fileType,
      fileSize: fileSize || 0,
      batches: validBatchIds,
      isPublic: isPublic || false,
      uploadedBy: req.user._id,
    });

    const populatedMaterial = await Material.findById(material._id)
      .populate('batches', 'name level')
      .populate('uploadedBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      data: populatedMaterial,
    });
  } catch (error) {
    console.error('Upload Material Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading material',
    });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { title, description, category, batchIds, isPublic } = req.body;

    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    // Update fields
    if (title) material.title = title;
    if (description !== undefined) material.description = description;
    if (category) material.category = category;
    if (isPublic !== undefined) material.isPublic = isPublic;

    // Update batches if provided
    if (batchIds !== undefined) {
      const batches = await Batch.find({ _id: { $in: batchIds } });
      material.batches = batches.map((b) => b._id);
    }

    await material.save();

    const updatedMaterial = await Material.findById(material._id)
      .populate('batches', 'name level')
      .populate('uploadedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      data: updatedMaterial,
    });
  } catch (error) {
    console.error('Update Material Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating material',
    });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    await material.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    console.error('Delete Material Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting material',
    });
  }
};

const trackDownload = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found',
      });
    }

    material.downloads += 1;
    await material.save();

    res.status(200).json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error('Track Download Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking download',
    });
  }
};

module.exports = {
  getMaterials,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  trackDownload,
  upload,
  // Upload file and return URL + metadata
  uploadMaterialFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      const fileBase = isVercel ? '/tmp-materials' : '/uploads/materials';
      const fileUrl = `${req.protocol}://${req.get('host')}${fileBase}/${req.file.filename}`;
      return res.status(200).json({
        success: true,
        data: {
          fileUrl,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          fileType: req.file.mimetype
        }
      });
    } catch (error) {
      console.error('Upload file error:', error);
      return res.status(500).json({ success: false, message: 'Error uploading file' });
    }
  }
};
