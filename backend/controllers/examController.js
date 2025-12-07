const Exam = require('../models/Exam');
const User = require('../models/User');

// @desc    Get all exams for a student
// @route   GET /api/exams
// @access  Private (Student/Admin)
exports.getStudentExams = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user._id : req.query.studentId;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide student ID',
      });
    }

    const exams = await Exam.find({
      student: studentId,
      isPublished: true,
    })
      .populate('batch', 'name level')
      .sort({ examDate: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (err) {
    console.error('Error fetching student exams:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single exam details
// @route   GET /api/exams/:id
// @access  Private (Student/Admin)
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('student', 'firstName lastName email phone')
      .populate('batch', 'name level');

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check authorization
    if (
      req.user.role === 'student' &&
      exam.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this exam',
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (err) {
    console.error('Error fetching exam:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Create new exam (Admin only)
// @route   POST /api/exams
// @access  Private (Admin)
exports.createExam = async (req, res) => {
  try {
    const {
      student,
      examName,
      examType,
      examLevel,
      examDate,
      duration,
      totalMarks,
      marksObtained,
      components,
      examiner,
      remarks,
      strengths,
      areasOfImprovement,
      marksheetUrl,
      certificateUrl,
      batch,
      isPublished,
    } = req.body;

    // Validate student exists
    const studentExists = await User.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    const exam = await Exam.create({
      student,
      examName,
      examType,
      examLevel,
      examDate,
      duration,
      totalMarks,
      marksObtained,
      components,
      examiner,
      remarks,
      strengths,
      areasOfImprovement,
      marksheetUrl,
      certificateUrl,
      batch,
      isPublished: isPublished || false,
      status: isPublished ? 'Published' : 'Pending',
    });

    // Update student's exam count
    if (isPublished) {
      await User.findByIdAndUpdate(student, {
        $inc: { 'examInfo.examsGiven': 1 },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam,
    });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Update exam (Admin only)
// @route   PUT /api/exams/:id
// @access  Private (Admin)
exports.updateExam = async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    const wasPublished = exam.isPublished;

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If exam is newly published, update student's exam count
    if (!wasPublished && exam.isPublished) {
      await User.findByIdAndUpdate(exam.student, {
        $inc: { 'examInfo.examsGiven': 1 },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: exam,
    });
  } catch (err) {
    console.error('Error updating exam:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Delete exam (Admin only)
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    await exam.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get exam statistics for a student
// @route   GET /api/exams/stats/:studentId
// @access  Private (Student/Admin)
exports.getExamStats = async (req, res) => {
  try {
    const studentId =
      req.user.role === 'student' ? req.user._id : req.params.studentId;

    const exams = await Exam.find({
      student: studentId,
      isPublished: true,
    });

    if (exams.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalExams: 0,
          averagePercentage: 0,
          highestScore: 0,
          lowestScore: 0,
          gradeDistribution: {},
        },
      });
    }

    const totalExams = exams.length;
    const totalPercentage = exams.reduce((sum, exam) => sum + parseFloat(exam.percentage), 0);
    const averagePercentage = (totalPercentage / totalExams).toFixed(2);

    const percentages = exams.map((exam) => parseFloat(exam.percentage));
    const highestScore = Math.max(...percentages);
    const lowestScore = Math.min(...percentages);

    const gradeDistribution = exams.reduce((acc, exam) => {
      acc[exam.grade] = (acc[exam.grade] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        totalExams,
        averagePercentage,
        highestScore,
        lowestScore,
        gradeDistribution,
        recentExams: exams.slice(0, 5),
      },
    });
  } catch (err) {
    console.error('Error fetching exam stats:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
