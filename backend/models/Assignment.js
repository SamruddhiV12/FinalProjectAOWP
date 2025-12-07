const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Please provide assignment title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide assignment description'],
    },

    // Assignment Details
    type: {
      type: String,
      enum: ['video', 'theory', 'practice', 'written'],
      default: 'video',
    },
    batch: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced', 'all'],
      default: 'all',
    },

    // Grading
    maxPoints: {
      type: Number,
      default: 100,
    },

    // Deadlines
    dueDate: {
      type: Date,
      required: [true, 'Please provide due date'],
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },

    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Instructions
    instructions: {
      type: String,
      default: '',
    },

    // Statistics (for quick access)
    stats: {
      totalSubmissions: { type: Number, default: 0 },
      gradedSubmissions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
AssignmentSchema.index({ batch: 1, status: 1, dueDate: -1 });
AssignmentSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
