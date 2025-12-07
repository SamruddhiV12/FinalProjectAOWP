const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    // store as first day of month for uniqueness
    month: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'pending',
    },
    method: {
      type: String,
      default: 'Cash',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    paidOn: {
      type: Date,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

PaymentSchema.index({ student: 1, month: 1, batch: 1 }, { unique: true });
PaymentSchema.index({ batch: 1, month: 1 });
PaymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
