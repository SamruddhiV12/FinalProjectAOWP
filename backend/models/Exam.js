const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema(
  {
    // Student Reference
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide student ID'],
    },

    // Exam Details
    examName: {
      type: String,
      required: [true, 'Please provide exam name'],
      trim: true,
    },
    examType: {
      type: String,
      enum: ['Theory', 'Practical', 'Combined', 'Arangetram', 'Performance', 'Mid-term', 'Final'],
      required: [true, 'Please provide exam type'],
    },
    examLevel: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced', 'Junior', 'Senior', 'Arangetram'],
      required: [true, 'Please provide exam level'],
    },

    // Date and Duration
    examDate: {
      type: Date,
      required: [true, 'Please provide exam date'],
    },
    duration: {
      type: Number, // in minutes
      default: 60,
    },

    // Marks
    totalMarks: {
      type: Number,
      required: [true, 'Please provide total marks'],
      default: 100,
    },
    marksObtained: {
      type: Number,
      required: [true, 'Please provide marks obtained'],
    },
    percentage: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'Pass', 'Fail'],
    },

    // Detailed Scores (for different components)
    components: [
      {
        name: {
          type: String,
          required: true,
        },
        maxMarks: {
          type: Number,
          required: true,
        },
        marksObtained: {
          type: Number,
          required: true,
        },
      },
    ],

    // Examiner Details
    examiner: {
      name: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        default: 'Teacher',
      },
    },

    // Remarks and Feedback
    remarks: {
      type: String,
      default: '',
    },
    strengths: {
      type: String,
      default: '',
    },
    areasOfImprovement: {
      type: String,
      default: '',
    },

    // Marksheet/Certificate
    marksheetUrl: {
      type: String,
      default: '',
    },
    certificateUrl: {
      type: String,
      default: '',
    },

    // Status
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Published', 'Withheld'],
      default: 'Pending',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    // Batch Reference
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
    },
  },
  {
    timestamps: true,
  }
);

// Calculate percentage before saving
ExamSchema.pre('save', function (next) {
  if (this.marksObtained && this.totalMarks) {
    this.percentage = ((this.marksObtained / this.totalMarks) * 100).toFixed(2);
  }

  // Auto-calculate grade
  if (this.percentage >= 90) this.grade = 'A+';
  else if (this.percentage >= 80) this.grade = 'A';
  else if (this.percentage >= 70) this.grade = 'B+';
  else if (this.percentage >= 60) this.grade = 'B';
  else if (this.percentage >= 50) this.grade = 'C+';
  else if (this.percentage >= 40) this.grade = 'C';
  else if (this.percentage >= 33) this.grade = 'D';
  else this.grade = 'F';

  next();
});

// Index for faster queries
ExamSchema.index({ student: 1, examDate: -1 });
ExamSchema.index({ status: 1, isPublished: 1 });

module.exports = mongoose.model('Exam', ExamSchema);
