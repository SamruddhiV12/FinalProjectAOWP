const Attendance = require('../models/Attendance');
const Batch = require('../models/Batch');
const User = require('../models/User');

// @desc    Mark attendance for a batch
// @route   POST /api/attendance
// @access  Private (Admin/Teacher)
const markAttendance = async (req, res) => {
  try {
    const { batchId, date, records, topic, duration } = req.body;

    // Check if batch exists
    const batch = await Batch.findById(batchId).populate('students');
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    // Check if attendance already exists for this batch on this date
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      batch: batchId,
      date: {
        $gte: attendanceDate,
        $lt: new Date(attendanceDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.records = records;
      existingAttendance.topic = topic || '';
      existingAttendance.duration = duration || 60;
      existingAttendance.markedBy = req.user.id;
      await existingAttendance.save();

      const updatedAttendance = await Attendance.findById(existingAttendance._id)
        .populate('batch', 'name level')
        .populate('records.student', 'firstName lastName email')
        .populate('markedBy', 'firstName lastName');

      return res.status(200).json({
        success: true,
        message: 'Attendance updated successfully',
        data: updatedAttendance,
      });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      batch: batchId,
      date: attendanceDate,
      records,
      markedBy: req.user.id,
      topic: topic || '',
      duration: duration || 60,
    });

    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('batch', 'name level')
      .populate('records.student', 'firstName lastName email')
      .populate('markedBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: populatedAttendance,
    });
  } catch (error) {
    console.error('Mark Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking attendance',
      error: error.message,
    });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendanceRecords = async (req, res) => {
  try {
    const { batchId, startDate, endDate, studentId } = req.query;

    let query = {};

    if (batchId) {
      query.batch = batchId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    let attendance = await Attendance.find(query)
      .populate('batch', 'name level')
      .populate('records.student', 'firstName lastName email')
      .populate('markedBy', 'firstName lastName')
      .sort({ date: -1 });

    // Filter by student if provided
    if (studentId) {
      attendance = attendance.filter((record) =>
        record.records.some((r) => r.student._id.toString() === studentId)
      );
    }

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    console.error('Get Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records',
      error: error.message,
    });
  }
};

// @desc    Get attendance by ID
// @route   GET /api/attendance/:id
// @access  Private
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('batch', 'name level schedule')
      .populate('records.student', 'firstName lastName email phone')
      .populate('markedBy', 'firstName lastName');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error('Get Attendance Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance record',
      error: error.message,
    });
  }
};

// @desc    Get student attendance summary
// @route   GET /api/attendance/student/:studentId/summary
// @access  Private
const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) {
        dateQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateQuery.date.$lte = end;
      }
    }

    const attendanceRecords = await Attendance.find({
      ...dateQuery,
      'records.student': studentId,
    }).populate('batch', 'name level');

    let totalClasses = 0;
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    attendanceRecords.forEach((record) => {
      const studentRecord = record.records.find(
        (r) => r.student.toString() === studentId
      );
      if (studentRecord) {
        totalClasses++;
        switch (studentRecord.status) {
          case 'present':
            present++;
            break;
          case 'absent':
            absent++;
            break;
          case 'late':
            late++;
            break;
          case 'excused':
            excused++;
            break;
        }
      }
    });

    const attendancePercentage =
      totalClasses > 0
        ? Math.round(((present + late) / totalClasses) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
        },
        summary: {
          totalClasses,
          present,
          absent,
          late,
          excused,
          attendancePercentage,
        },
        records: attendanceRecords,
      },
    });
  } catch (error) {
    console.error('Get Student Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance summary',
      error: error.message,
    });
  }
};

// @desc    Get batch attendance summary
// @route   GET /api/attendance/batch/:batchId/summary
// @access  Private
const getBatchAttendanceSummary = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { startDate, endDate } = req.query;

    // Verify batch exists
    const batch = await Batch.findById(batchId).populate(
      'students',
      'firstName lastName email'
    );
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    let dateQuery = { batch: batchId };
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) {
        dateQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateQuery.date.$lte = end;
      }
    }

    const attendanceRecords = await Attendance.find(dateQuery).sort({
      date: -1,
    });

    const totalClasses = attendanceRecords.length;
    const avgAttendance =
      totalClasses > 0
        ? attendanceRecords.reduce(
            (sum, record) => sum + record.attendancePercentage,
            0
          ) / totalClasses
        : 0;

    res.status(200).json({
      success: true,
      data: {
        batch: {
          id: batch._id,
          name: batch.name,
          level: batch.level,
          totalStudents: batch.students.length,
        },
        summary: {
          totalClasses,
          avgAttendance: Math.round(avgAttendance),
        },
        records: attendanceRecords,
      },
    });
  } catch (error) {
    console.error('Get Batch Summary Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching batch attendance summary',
      error: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAttendanceRecords,
  getAttendanceById,
  getStudentAttendanceSummary,
  getBatchAttendanceSummary,
};
