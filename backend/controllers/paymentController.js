const Payment = require('../models/Payment');
const Batch = require('../models/Batch');
const User = require('../models/User');
const { createNotificationsForUsers } = require('./notificationController');

const parseMonth = (monthStr) => {
  if (!monthStr) return null;
  const [year, month] = monthStr.split('-').map(Number);
  if (!year || !month) return null;
  return new Date(Date.UTC(year, month - 1, 1));
};

const upsertPayment = async (req, res) => {
  try {
    const { studentId, batchId, month, amount, status, method, notes, paidOn, notify } = req.body;
    const parsedMonth = parseMonth(month);

    if (!studentId || !batchId || !parsedMonth) {
      return res.status(400).json({
        success: false,
        message: 'studentId, batchId, and month (YYYY-MM) are required',
      });
    }

    const batch = await Batch.findById(batchId).populate('students', '_id');
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const studentInBatch = batch.students.some((s) => s._id.toString() === studentId);
    if (!studentInBatch) {
      return res.status(400).json({
        success: false,
        message: 'Student is not part of this batch',
      });
    }

    const resolvedAmount = amount !== undefined ? amount : batch.monthlyFee || 0;

    const resolvedPaidOn = paidOn ? new Date(paidOn) : status === 'paid' ? new Date() : null;

    const payment = await Payment.findOneAndUpdate(
      { student: studentId, batch: batchId, month: parsedMonth },
      {
        $set: {
          amount: resolvedAmount,
          status: status || 'pending',
          method: method || 'Cash',
          notes: notes || '',
          paidOn: resolvedPaidOn,
          recordedBy: req.user._id,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate('student', 'firstName lastName email')
      .populate('batch', 'name level');

    if (notify && (status === 'pending' || !status)) {
      await createNotificationsForUsers({
        userIds: [studentId],
        type: 'payment_reminder',
        title: 'Payment pending',
        message: `Your payment for ${month} is pending. Amount: ₹${resolvedAmount}`,
        meta: { batchId, month, amount: resolvedAmount },
      });
    }

    return res.status(201).json({
      success: true,
      data: payment,
      message: 'Payment saved',
    });
  } catch (error) {
    console.error('Upsert Payment Error:', error);
    return res.status(500).json({ success: false, message: 'Error saving payment', error: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const { batchId, studentId, month, status } = req.query;
    const query = {};

    if (batchId) query.batch = batchId;
    if (status) query.status = status;

    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (studentId) {
      query.student = studentId;
    }

    if (month) {
      const start = parseMonth(month);
      if (!start) {
        return res.status(400).json({ success: false, message: 'Invalid month format, use YYYY-MM' });
      }
      const end = new Date(start);
      end.setUTCMonth(end.getUTCMonth() + 1);
      query.month = { $gte: start, $lt: end };
    }

    const payments = await Payment.find(query)
      .populate('student', 'firstName lastName email')
      .populate('batch', 'name level')
      .sort({ month: -1 });

    return res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    console.error('Get Payments Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching payments', error: error.message });
  }
};

const getBatchMonthView = async (req, res) => {
  try {
    const { batchId, month } = req.query;
    const parsedMonth = parseMonth(month);

    if (!batchId || !parsedMonth) {
      return res.status(400).json({ success: false, message: 'batchId and month (YYYY-MM) are required' });
    }

    const batch = await Batch.findById(batchId).populate('students', 'firstName lastName email');
    if (!batch) {
      return res.status(404).json({ success: false, message: 'Batch not found' });
    }

    const end = new Date(parsedMonth);
    end.setUTCMonth(end.getUTCMonth() + 1);

    const payments = await Payment.find({
      batch: batchId,
      month: { $gte: parsedMonth, $lt: end },
    });

    const paymentMap = payments.reduce((acc, p) => {
      acc[p.student.toString()] = p;
      return acc;
    }, {});

    const students = batch.students.map((student) => {
      const pay = paymentMap[student._id.toString()];
      return {
        id: student._id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        status: pay?.status || 'pending',
        amount: pay?.amount ?? batch.monthlyFee,
        method: pay?.method || 'Cash',
        paidOn: pay?.paidOn || null,
        notes: pay?.notes || '',
        paymentId: pay?._id || null,
        updatedAt: pay?.updatedAt || null,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        batch: {
          id: batch._id,
          name: batch.name,
          level: batch.level,
          monthlyFee: batch.monthlyFee,
          studentCount: batch.students.length,
        },
        month: parsedMonth,
        students,
      },
    });
  } catch (error) {
    console.error('Batch Month View Error:', error);
    return res.status(500).json({ success: false, message: 'Error fetching batch payment view', error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const allowed = ['amount', 'status', 'method', 'notes', 'paidOn'];
    const updates = {};

    Object.keys(req.body).forEach((key) => {
      if (allowed.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    updates.recordedBy = req.user._id;

    const payment = await Payment.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('student', 'firstName lastName email')
      .populate('batch', 'name level');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    return res.status(200).json({ success: true, data: payment, message: 'Payment updated' });
  } catch (error) {
    console.error('Update Payment Error:', error);
    return res.status(500).json({ success: false, message: 'Error updating payment', error: error.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const { batchId, month } = req.query;
    const match = {};
    if (batchId) match.batch = batchId;
    if (month) {
      const start = parseMonth(month);
      if (!start) {
        return res.status(400).json({ success: false, message: 'Invalid month format, use YYYY-MM' });
      }
      const end = new Date(start);
      end.setUTCMonth(end.getUTCMonth() + 1);
      match.month = { $gte: start, $lt: end };
    }

    const summary = await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const response = summary.reduce(
      (acc, curr) => {
        acc[curr._id] = {
          count: curr.count,
          amount: curr.totalAmount,
        };
        return acc;
      },
      { paid: { count: 0, amount: 0 }, pending: { count: 0, amount: 0 } }
    );

    return res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Payment Summary Error:', error);
    return res.status(500).json({ success: false, message: 'Error building summary', error: error.message });
  }
};

module.exports = { upsertPayment, getPayments, updatePayment, getSummary, getBatchMonthView };
