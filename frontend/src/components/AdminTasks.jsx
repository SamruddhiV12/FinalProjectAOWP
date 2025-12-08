import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

const emptyForm = {
  title: '',
  description: '',
  category: 'other',
  priority: 'medium',
  dueDate: '',
};

function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, config);
      setTasks(res.data?.data || []);
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, form, config);
      setForm(emptyForm);
      fetchTasks();
    } catch (err) {
      console.error('Create task error:', err);
      setError('Failed to create task');
    }
  };

  const handleStatusToggle = async (taskId, status) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, { status }, config);
      fetchTasks();
    } catch (err) {
      console.error('Update task error:', err);
      setError('Failed to update task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, config);
      fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err);
      setError('Failed to delete task');
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-bar">
        <div className="header-left">
          <h1 className="dashboard-title">Pending Tasks</h1>
          <p className="header-date">Create and track admin tasks</p>
        </div>
      </div>

      {error && (
        <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', background: '#fff3cd', color: '#856404', borderRadius: '10px' }}>
          {error}
        </div>
      )}

      {/* Create Task Form */}
      <div className="full-width-section">
        <h2 className="section-title">➕ Create Task</h2>
        <form onSubmit={handleCreate} className="actions-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="assignment">Assignment</option>
              <option value="payment">Payment</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-primary">Create Task</button>
          </div>
        </form>
      </div>

      {/* Pending Tasks */}
      <div className="full-width-section">
        <h2 className="section-title">⏳ Pending</h2>
        <div className="content-grid">
          {loading ? (
            <div style={{ padding: '1rem' }}>Loading...</div>
          ) : pendingTasks.length === 0 ? (
            <div style={{ padding: '1rem', color: '#6B6B6B' }}>No pending tasks.</div>
          ) : (
            pendingTasks.map((task) => (
              <div key={task._id} className="content-card">
                <div className="content-card-header">
                  <span className="content-badge pending">{task.category}</span>
                  <span className="content-badge" style={{ marginLeft: 'auto' }}>{task.priority}</span>
                </div>
                <h3 className="content-title">{task.title}</h3>
                <p className="content-desc">{task.description || 'No description'}</p>
                <p className="content-meta">
                  {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                </p>
                <div className="content-meta" style={{ gap: '0.75rem' }}>
                  <button className="btn-secondary" type="button" onClick={() => handleStatusToggle(task._id, 'completed')}>Mark Done</button>
                  <button className="btn-outline" type="button" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="full-width-section">
        <h2 className="section-title">✅ Completed</h2>
        <div className="content-grid">
          {loading ? (
            <div style={{ padding: '1rem' }}>Loading...</div>
          ) : completedTasks.length === 0 ? (
            <div style={{ padding: '1rem', color: '#6B6B6B' }}>No completed tasks.</div>
          ) : (
            completedTasks.map((task) => (
              <div key={task._id} className="content-card">
                <div className="content-card-header">
                  <span className="content-badge">{task.category}</span>
                  <span className="content-badge" style={{ marginLeft: 'auto' }}>{task.priority}</span>
                </div>
                <h3 className="content-title">{task.title}</h3>
                <p className="content-desc">{task.description || 'No description'}</p>
                <p className="content-meta">
                  {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'}
                </p>
                <div className="content-meta" style={{ gap: '0.75rem' }}>
                  <button className="btn-secondary" onClick={() => handleStatusToggle(task._id, 'pending')}>Mark Pending</button>
                  <button className="btn-outline" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTasks;
