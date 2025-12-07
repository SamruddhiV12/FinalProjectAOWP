const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    // Batch Reference
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },

    // Date of attendance
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Student attendance records
    records: [{
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        default: 'absent',
      },
      notes: {
        type: String,
        default: '',
      },
    }],

    // Marked by (Admin/Teacher)
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Class details
    topic: {
      type: String,
      default: '',
    },

    duration: {
      type: Number, // in minutes
      default: 60,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique attendance per batch per date
AttendanceSchema.index({ batch: 1, date: 1 });

// Virtual for total present
AttendanceSchema.virtual('totalPresent').get(function () {
  return this.records.filter(r => r.status === 'present').length;
});

// Virtual for total absent
AttendanceSchema.virtual('totalAbsent').get(function () {
  return this.records.filter(r => r.status === 'absent').length;
});

// Virtual for attendance percentage
AttendanceSchema.virtual('attendancePercentage').get(function () {
  if (this.records.length === 0) return 0;
  const presentCount = this.records.filter(r => r.status === 'present' || r.status === 'late').length;
  return Math.round((presentCount / this.records.length) * 100);
});

// Ensure virtuals are included
AttendanceSchema.set('toJSON', { virtuals: true });
AttendanceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
