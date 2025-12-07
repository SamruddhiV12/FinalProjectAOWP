const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema(
  {
    // Batch Information
    name: {
      type: String,
      required: [true, 'Please provide batch name'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      required: [true, 'Please specify batch level'],
    },

    // Schedule
    schedule: {
      days: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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
    },

    // Instructor
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Students in this batch
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    // Capacity
    maxStudents: {
      type: Number,
      default: 15,
    },

    monthlyFee: {
      type: Number,
      default: 3000,
      min: 0,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Additional Info
    description: {
      type: String,
      default: '',
    },

    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
BatchSchema.index({ level: 1, isActive: 1 });
BatchSchema.index({ instructor: 1 });

// Virtual for current enrollment
BatchSchema.virtual('currentEnrollment').get(function () {
  return this.students ? this.students.length : 0;
});

// Virtual for available seats
BatchSchema.virtual('availableSeats').get(function () {
  const studentCount = this.students ? this.students.length : 0;
  return this.maxStudents - studentCount;
});

// Ensure virtuals are included
BatchSchema.set('toJSON', { virtuals: true });
BatchSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Batch', BatchSchema);
