const mongoose = require('mongoose');
const User = require('../models/User');
const Batch = require('../models/Batch');

// @desc    Get student profile
// @route   GET /api/student-profile/:id
// @access  Private (Student/Admin)
exports.getStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id || req.user._id;

    const student = await User.findById(studentId).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Get batch information
    let batchInfo = null;
    if (student.danceInfo && student.danceInfo.currentBatch) {
      batchInfo = await Batch.findOne({
        level: student.danceInfo.currentBatch,
        students: studentId,
      }).select('name level schedule');
    }

    res.status(200).json({
      success: true,
      data: {
        ...student.toObject(),
        batchInfo,
      },
    });
  } catch (err) {
    console.error('Error fetching student profile:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update student profile
// @route   PUT /api/student-profile/:id
// @access  Private (Student/Admin)
exports.updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.params.id || req.user._id;

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Only allow students to update their own profile or admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this profile',
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'firstName',
      'lastName',
      'phone',
      'dateOfBirth',
      'gender',
      'address',
      'emergencyContact',
      'profilePicture',
      'notifications',
    ];

    // If admin, allow updating dance info
    if (req.user.role === 'admin') {
      allowedUpdates.push('danceInfo', 'isActive');
    }

    // Build update object
    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedStudent = await User.findByIdAndUpdate(
      studentId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedStudent,
    });
  } catch (err) {
    console.error('Error updating student profile:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get student stats
// @route   GET /api/student-profile/:id/stats
// @access  Private (Student/Admin)
exports.getStudentStats = async (req, res) => {
  try {
    const studentId = req.params.id || req.user._id;

    const student = await User.findById(studentId).select('stats danceInfo examInfo');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Get additional stats from related collections
    const Attendance = require('../models/Attendance');
    const AssignmentSubmission = require('../models/AssignmentSubmission');
    const Exam = require('../models/Exam');

    // Aggregate attendance per student across all records
    const attendanceAgg = await Attendance.aggregate([
      { $match: { 'records.student': new mongoose.Types.ObjectId(studentId) } },
      { $unwind: '$records' },
      { $match: { 'records.student': new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: null,
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: {
              $cond: [
                { $in: ['$records.status', ['present', 'late']] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const totalClasses = attendanceAgg[0]?.totalClasses || 0;
    const attendanceCount = attendanceAgg[0]?.presentCount || 0;

    // Count submitted assignments
    const assignmentsCompleted = await AssignmentSubmission.countDocuments({
      student: studentId,
      status: { $in: ['Submitted', 'Graded'] },
    });

    // Count completed exams (exams where student has a record)
    const examsGiven = await Exam.countDocuments({
      'students.student': studentId,
    });

    const attendancePercentage =
      totalClasses > 0 ? parseFloat(((attendanceCount / totalClasses) * 100).toFixed(2)) : 0;

    res.status(200).json({
      success: true,
      data: {
        attendance: attendancePercentage,
        totalClasses,
        classesAttended: attendanceCount,
        assignmentsCompleted,
        examsGiven,
        enrollmentDate: student.danceInfo?.enrollmentDate,
        currentBatch: student.danceInfo?.currentBatch,
        examLevel: student.examInfo?.examLevel,
      },
    });
  } catch (err) {
    console.error('Error fetching student stats:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
