const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');

// @desc    Get all assignments (filtered for students)
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    const user = req.user;
    let query = { status: 'active' };

    // For students, filter by their batch or 'all'
    if (user.role === 'student') {
      const userBatch = user.danceInfo?.currentBatch || 'basic';
      query.$or = [
        { batch: userBatch },
        { batch: 'all' }
      ];
    } else if (req.query.batch && req.query.batch !== 'all') {
      // For admin filtering
      query.batch = req.query.batch;
    }

    const assignments = await Assignment.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ dueDate: -1 });

    // For students, attach submission status
    if (user.role === 'student') {
      const assignmentsWithStatus = await Promise.all(
        assignments.map(async (assignment) => {
          const submission = await AssignmentSubmission.findOne({
            assignment: assignment._id,
            student: user._id
          });

          return {
            ...assignment.toObject(),
            submissionStatus: submission ? submission.status : 'Not Submitted',
            submissionId: submission?._id,
            submittedAt: submission?.submittedAt,
            grade: submission?.grade,
            feedback: submission?.feedback
          };
        })
      );

      return res.status(200).json({
        success: true,
        count: assignmentsWithStatus.length,
        data: assignmentsWithStatus
      });
    }

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Get count of submissions pending review
// @route   GET /api/assignments/pending/reviews
// @access  Private (Admin)
exports.getPendingReviewCount = async (req, res) => {
  try {
    const pendingCount = await AssignmentSubmission.countDocuments({ status: 'Submitted' });

    res.status(200).json({
      success: true,
      count: pendingCount,
    });
  } catch (err) {
    console.error('Error fetching pending reviews:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// @desc    Get single assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // For students, attach submission info
    if (req.user.role === 'student') {
      const submission = await AssignmentSubmission.findOne({
        assignment: assignment._id,
        student: req.user._id
      });

      return res.status(200).json({
        success: true,
        data: {
          ...assignment.toObject(),
          submission: submission || null
        }
      });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (err) {
    console.error('Error fetching assignment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Create new assignment (Admin only)
// @route   POST /api/assignments
// @access  Private (Admin)
exports.createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      batch,
      maxPoints,
      dueDate,
      instructions
    } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      type,
      batch,
      maxPoints,
      dueDate,
      instructions,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: assignment
    });
  } catch (err) {
    console.error('Error creating assignment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Update assignment (Admin only)
// @route   PUT /api/assignments/:id
// @access  Private (Admin)
exports.updateAssignment = async (req, res) => {
  try {
    const allowedUpdates = [
      'title',
      'description',
      'type',
      'batch',
      'maxPoints',
      'dueDate',
      'instructions',
      'status'
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });
  } catch (err) {
    console.error('Error updating assignment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Delete assignment (Admin only)
// @route   DELETE /api/assignments/:id
// @access  Private (Admin)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Also delete all submissions for this assignment
    await AssignmentSubmission.deleteMany({ assignment: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting assignment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Submit assignment (Student)
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res) => {
  try {
    const { submissionText, submissionUrl } = req.body;
    const assignmentId = req.params.id;

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if already submitted
    let submission = await AssignmentSubmission.findOne({
      assignment: assignmentId,
      student: req.user._id
    });

    if (submission) {
      // Update existing submission
      submission.submissionText = submissionText || submission.submissionText;
      submission.submissionUrl = submissionUrl || submission.submissionUrl;
      submission.status = 'Submitted';
      submission.submittedAt = new Date();
      await submission.save();

      return res.status(200).json({
        success: true,
        message: 'Assignment re-submitted successfully',
        data: submission
      });
    }

    // Create new submission
    submission = await AssignmentSubmission.create({
      assignment: assignmentId,
      student: req.user._id,
      submissionText,
      submissionUrl,
      status: 'Submitted',
      submittedAt: new Date()
    });

    // Update assignment stats
    assignment.stats.totalSubmissions += 1;
    await assignment.save();

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission
    });
  } catch (err) {
    console.error('Error submitting assignment:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Grade assignment submission (Admin)
// @route   PUT /api/assignments/submissions/:submissionId/grade
// @access  Private (Admin)
exports.gradeSubmission = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const submissionId = req.params.submissionId;

    const submission = await AssignmentSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'Graded';
    submission.gradedAt = new Date();
    submission.gradedBy = req.user._id;
    await submission.save();

    // Update assignment stats
    const assignment = await Assignment.findById(submission.assignment);
    if (assignment) {
      assignment.stats.gradedSubmissions += 1;

      // Recalculate average score
      const allGradedSubmissions = await AssignmentSubmission.find({
        assignment: assignment._id,
        status: 'Graded'
      });

      const totalScore = allGradedSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
      assignment.stats.averageScore = totalScore / allGradedSubmissions.length;

      await assignment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Submission graded successfully',
      data: submission
    });
  } catch (err) {
    console.error('Error grading submission:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

// @desc    Get submissions for an assignment (Admin)
// @route   GET /api/assignments/:id/submissions
// @access  Private (Admin)
exports.getAssignmentSubmissions = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const submissions = await AssignmentSubmission.find({ assignment: assignmentId })
      .populate('student', 'firstName lastName email danceInfo')
      .populate('gradedBy', 'firstName lastName')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
