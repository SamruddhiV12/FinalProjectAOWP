const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Create a new batch
// @route   POST /api/batches
// @access  Private (Admin)
const createBatch = async (req, res) => {
  try {
    const {
      name,
      level,
      schedule,
      instructor,
      maxStudents,
      description,
      monthlyFee,
    } = req.body;

    // Check if instructor exists and has teacher/admin role
    const instructorUser = await User.findById(instructor);
    if (!instructorUser || (instructorUser.role !== 'teacher' && instructorUser.role !== 'admin')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid instructor. Must be a teacher or admin.',
      });
    }

    const batch = await Batch.create({
      name,
      level,
      schedule,
      instructor,
      maxStudents: maxStudents || 15,
      description: description || '',
      monthlyFee: monthlyFee || 3000,
    });

    res.status(201).json({
      success: true,
      message: 'Batch created successfully',
      data: batch,
    });
  } catch (error) {
    console.error('Create Batch Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating batch',
      error: error.message,
    });
  }
};

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
const getAllBatches = async (req, res) => {
  try {
    const { level, isActive } = req.query;

    let query = {};

    if (level && level !== 'all') {
      query.level = level;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const batches = await Batch.find(query)
      .populate('instructor', 'firstName lastName email')
      .populate('students', 'firstName lastName email danceInfo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: batches.length,
      data: batches,
    });
  } catch (error) {
    console.error('Get Batches Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batches',
      error: error.message,
    });
  }
};

// @desc    Get batch by ID
// @route   GET /api/batches/:id
// @access  Private
const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findById(req.params.id)
      .populate('instructor', 'firstName lastName email phone')
      .populate('students', 'firstName lastName email phone danceInfo');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    console.error('Get Batch Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch',
      error: error.message,
    });
  }
};

// @desc    Update batch
// @route   PUT /api/batches/:id
// @access  Private (Admin)
const updateBatch = async (req, res) => {
  try {
    const allowedUpdates = [
      'name',
      'level',
      'schedule',
      'instructor',
      'maxStudents',
      'isActive',
      'description',
      'monthlyFee',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // If updating instructor, validate
    if (updates.instructor) {
      const instructorUser = await User.findById(updates.instructor);
      if (!instructorUser || (instructorUser.role !== 'teacher' && instructorUser.role !== 'admin')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid instructor. Must be a teacher or admin.',
        });
      }
    }

    const batch = await Batch.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('instructor', 'firstName lastName email')
      .populate('students', 'firstName lastName email');

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Batch updated successfully',
      data: batch,
    });
  } catch (error) {
    console.error('Update Batch Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating batch',
      error: error.message,
    });
  }
};

// @desc    Add student to batch
// @route   POST /api/batches/:id/students
// @access  Private (Admin)
const addStudentToBatch = async (req, res) => {
  try {
    const { studentId } = req.body;

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    // Check if batch is full
    if (batch.students.length >= batch.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Batch is full',
      });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Check if student already in batch
    if (batch.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student already in this batch',
      });
    }

    batch.students.push(studentId);
    await batch.save();

    // Update student's currentBatch
    await User.findByIdAndUpdate(studentId, {
      'danceInfo.currentBatch': batch.level,
    });

    const updatedBatch = await Batch.findById(req.params.id)
      .populate('instructor', 'firstName lastName email')
      .populate('students', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Student added to batch successfully',
      data: updatedBatch,
    });
  } catch (error) {
    console.error('Add Student Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding student to batch',
      error: error.message,
    });
  }
};

// @desc    Remove student from batch
// @route   DELETE /api/batches/:id/students/:studentId
// @access  Private (Admin)
const removeStudentFromBatch = async (req, res) => {
  try {
    const { studentId } = req.params;

    const batch = await Batch.findById(req.params.id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    // Remove student from batch
    batch.students = batch.students.filter(
      (id) => id.toString() !== studentId
    );
    await batch.save();

    const updatedBatch = await Batch.findById(req.params.id)
      .populate('instructor', 'firstName lastName email')
      .populate('students', 'firstName lastName email');

    res.status(200).json({
      success: true,
      message: 'Student removed from batch successfully',
      data: updatedBatch,
    });
  } catch (error) {
    console.error('Remove Student Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing student from batch',
      error: error.message,
    });
  }
};

// @desc    Get batch statistics
// @route   GET /api/batches/stats
// @access  Private (Admin)
const getBatchStats = async (req, res) => {
  try {
    const totalBatches = await Batch.countDocuments({ isActive: true });

    const levelStats = await Batch.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          totalStudents: { $sum: { $size: '$students' } },
        },
      },
    ]);

    const capacityStats = await Batch.aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          currentEnrollment: { $size: '$students' },
          maxStudents: 1,
          utilizationPercent: {
            $multiply: [
              { $divide: [{ $size: '$students' }, '$maxStudents'] },
              100,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgUtilization: { $avg: '$utilizationPercent' },
          totalCapacity: { $sum: '$maxStudents' },
          totalEnrolled: { $sum: '$currentEnrollment' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBatches,
        levelDistribution: levelStats.reduce((acc, item) => {
          acc[item._id] = {
            batches: item.count,
            students: item.totalStudents,
          };
          return acc;
        }, {}),
        capacity: capacityStats[0] || {
          avgUtilization: 0,
          totalCapacity: 0,
          totalEnrolled: 0,
        },
      },
    });
  } catch (error) {
    console.error('Get Batch Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch statistics',
      error: error.message,
    });
  }
};

module.exports = {
  createBatch,
  getAllBatches,
  getBatchById,
  updateBatch,
  addStudentToBatch,
  removeStudentFromBatch,
  getBatchStats,
};
