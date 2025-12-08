const mongoose = require('mongoose');

const AssignmentSubmissionSchema = new mongoose.Schema(
  {
    // References
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Submission Content
    submissionText: {
      type: String,
      default: ''
    },
    submissionUrl: {
      type: String,
      default: ''
    },

    // Status
    status: {
      type: String,
      enum: ['Not Submitted', 'Submitted', 'Graded'],
      default: 'Not Submitted'
    },

    // Grading
    grade: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    feedback: {
      type: String,
      default: ''
    },

    // Timestamps
    submittedAt: {
      type: Date,
      default: null
    },
    gradedAt: {
      type: Date,
      default: null
    },
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
AssignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
AssignmentSubmissionSchema.index({ student: 1, status: 1 });

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
