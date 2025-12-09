const ClassSchedule = require('../models/ClassSchedule');
const Batch = require('../models/Batch');
const { createNotificationsForUsers } = require('./notificationController');

const createSchedule = async (req, res) => {
  try {
    const { batchId, date, startTime, endTime, topic, location, notes } = req.body;

    // Verify batch exists
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Batch not found',
      });
    }

    const schedule = await ClassSchedule.create({
      batch: batchId,
      date,
      startTime,
      endTime,
      topic: topic || '',
      location: location || 'Main Studio',
      notes: notes || '',
      createdBy: req.user.id,
      isPublished: false,
    });

    const populatedSchedule = await ClassSchedule.findById(schedule._id)
      .populate('batch', 'name level')
      .populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Class schedule created successfully',
      data: populatedSchedule,
    });
  } catch (error) {
    console.error('Create Schedule Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating schedule',
      error: error.message,
    });
  }
};

const getSchedules = async (req, res) => {
  try {
    const { startDate, endDate, batchId, published } = req.query;

    let query = {};

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Batch filter
    if (batchId) {
      query.batch = batchId;
    }

    // Published filter (for students, show only published)
    if (published !== undefined) {
      query.isPublished = published === 'true';
    } else if (req.user.role === 'student') {
      // Students only see published schedules
      query.isPublished = true;
    }

    const schedules = await ClassSchedule.find(query)
      .populate('batch', 'name level')
      .populate('createdBy', 'firstName lastName')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    console.error('Get Schedules Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message,
    });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const schedule = await ClassSchedule.findById(req.params.id)
      .populate('batch', 'name level students')
      .populate('createdBy', 'firstName lastName');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('Get Schedule Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule',
      error: error.message,
    });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const allowedUpdates = [
      'date',
      'startTime',
      'endTime',
      'topic',
      'location',
      'notes',
      'isPublished',
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const schedule = await ClassSchedule.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('batch', 'name level')
      .populate('createdBy', 'firstName lastName');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule,
    });
  } catch (error) {
    console.error('Update Schedule Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: error.message,
    });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await ClassSchedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    console.error('Delete Schedule Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting schedule',
      error: error.message,
    });
  }
};

const togglePublish = async (req, res) => {
  try {
    const schedule = await ClassSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    schedule.isPublished = !schedule.isPublished;
    await schedule.save();

    const updatedSchedule = await ClassSchedule.findById(schedule._id)
      .populate('batch', 'name level')
      .populate('createdBy', 'firstName lastName');

    if (updatedSchedule.isPublished) {
      const batch = await Batch.findById(updatedSchedule.batch._id || updatedSchedule.batch).populate('students', '_id');
      if (batch) {
        const title = 'New class published';
        const message = `${batch.name} ${batch.level || ''} on ${new Date(updatedSchedule.date).toDateString()} ${updatedSchedule.startTime}-${updatedSchedule.endTime}`;
        await createNotificationsForUsers({
          userIds: batch.students.map((s) => s._id),
          type: 'schedule_published',
          title,
          message,
          meta: { scheduleId: updatedSchedule._id, batchId: batch._id },
          createdBy: req.user?._id,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Schedule ${schedule.isPublished ? 'published' : 'unpublished'} successfully`,
      data: updatedSchedule,
    });
  } catch (error) {
    console.error('Toggle Publish Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: error.message,
    });
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  togglePublish,
};
