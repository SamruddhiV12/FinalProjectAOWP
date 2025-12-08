const Task = require('../models/Task');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (Admin)
exports.createTask = async (req, res) => {
  try {
    const { title, description, category, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      category,
      status,
      priority,
      dueDate,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ success: false, message: 'Error creating task', error: error.message });
  }
};

// @desc    Get tasks (filter by status/category)
// @route   GET /api/tasks
// @access  Private (Admin)
exports.getTasks = async (req, res) => {
  try {
    const { status, category } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching tasks', error: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private (Admin)
exports.updateTask = async (req, res) => {
  try {
    const allowed = ['title', 'description', 'category', 'status', 'priority', 'dueDate'];
    const updates = {};
    Object.keys(req.body).forEach((k) => {
      if (allowed.includes(k)) updates[k] = req.body[k];
    });

    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ success: false, message: 'Error updating task', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ success: false, message: 'Error deleting task', error: error.message });
  }
};

