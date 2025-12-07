const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Material title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['Theory', 'Practice Videos', 'Exam Prep', 'Reference', 'Other'],
      default: 'Theory',
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
    },
    // Batch-wise access control
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
      },
    ],
    isPublic: {
      type: Boolean,
      default: false, // If true, visible to all students
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for faster queries
MaterialSchema.index({ batches: 1, isPublic: 1 });
MaterialSchema.index({ uploadedBy: 1, createdAt: -1 });

module.exports = mongoose.model('Material', MaterialSchema);
