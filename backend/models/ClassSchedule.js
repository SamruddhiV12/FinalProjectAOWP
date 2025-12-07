const mongoose = require('mongoose');

const ClassScheduleSchema = new mongoose.Schema(
  {
    // Batch reference
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },

    // Date and time
    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    // Topic (optional)
    topic: {
      type: String,
      default: '',
    },

    // Location (optional)
    location: {
      type: String,
      default: 'Main Studio',
    },

    // Published status
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Created by (teacher/admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Notes (optional)
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ClassScheduleSchema.index({ batch: 1, date: 1 });
ClassScheduleSchema.index({ date: 1, isPublished: 1 });
ClassScheduleSchema.index({ createdBy: 1 });

module.exports = mongoose.model('ClassSchedule', ClassScheduleSchema);
