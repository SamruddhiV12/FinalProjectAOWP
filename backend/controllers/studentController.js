const User = require('../models/User');

// @desc    Get all students (Admin only)
// @route   GET /api/students
// @access  Private (Admin)
const getAllStudents = async (req, res) => {
  try {
    const { batch, search } = req.query;

    // Build query
    let query = { role: 'student' };

    // Filter by batch if provided
    if (batch && batch !== 'all') {
      query['danceInfo.currentBatch'] = batch;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message,
    });
  }
};

// @desc    Get student by ID (Admin only)
// @route   GET /api/students/:id
// @access  Private (Admin)
const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Get Student Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message,
    });
  }
};

// @desc    Get students statistics (Admin only)
// @route   GET /api/students/stats
// @access  Private (Admin)
const getStudentStats = async (req, res) => {
  try {
    // Total students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Students by batch
    const batchStats = await User.aggregate([
      { $match: { role: 'student' } },
      {
        $group: {
          _id: '$danceInfo.currentBatch',
          count: { $sum: 1 },
        },
      },
    ]);

    // Active students (logged in recently)
    const activeStudents = await User.countDocuments({
      role: 'student',
      isActive: true,
    });

    // Students enrolled this month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const newStudentsThisMonth = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: currentMonth },
    });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        newStudentsThisMonth,
        batchDistribution: batchStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

// @desc    Update student details (Admin only)
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'dateOfBirth',
      'gender',
      'address',
      'emergencyContact',
      'danceInfo',
      'examInfo',
      'isActive',
      'stats',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'student' },
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    console.error('Update Student Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message,
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentStats,
  updateStudent,
};
