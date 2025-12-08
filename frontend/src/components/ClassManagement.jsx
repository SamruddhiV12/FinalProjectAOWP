import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ClassManagement.css';

function ClassManagement({ user }) {
  const [view, setView] = useState('dashboard'); // dashboard, create, calendar
  const [batches, setBatches] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [topic, setTopic] = useState('');
  const [location, setLocation] = useState('Main Studio');
  const [bulkMonth, setBulkMonth] = useState(new Date().toISOString().slice(0, 7));
  const [bulkDates, setBulkDates] = useState([]);
  const [bulkStartTime, setBulkStartTime] = useState('');
  const [bulkEndTime, setBulkEndTime] = useState('');
  const [bulkTopic, setBulkTopic] = useState('');
  const [bulkLocation, setBulkLocation] = useState('Main Studio');
  const [statusMessage, setStatusMessage] = useState('');
  const [editingId, setEditingId] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  useEffect(() => {
    fetchBatches();
    fetchSchedules();
  }, []);

  useEffect(() => {
    autoSelectWeekdaysForMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bulkMonth]);

  const autoSelectWeekdaysForMonth = () => {
    const monthDates = getDatesForMonth(bulkMonth);
    const weekdays = monthDates.filter((d) => {
      const day = new Date(d).getDay();
      return day !== 0 && day !== 6;
    });
    setBulkDates(weekdays);
  };

  const formatDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = `${dateObj.getMonth() + 1}`.padStart(2, '0');
    const day = `${dateObj.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDatesForMonth = (monthStr) => {
    const [year, month] = monthStr.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const dates = [];

    while (date.getMonth() === month - 1) {
      dates.push(formatDate(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/batches', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setBatches(data.data.filter((b) => b.isActive));
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/class-schedules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSchedules(data.data);
      }
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    if (!selectedBatch || !startTime || !endTime) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/class-schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          batchId: selectedBatch,
          date: selectedDate,
          startTime,
          endTime,
          topic,
          location,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Class scheduled successfully!');
        setSelectedBatch('');
        setStartTime('');
        setEndTime('');
        setTopic('');
        setLocation('Main Studio');
        fetchSchedules();
        setView('calendar');
      } else {
        alert('Failed to create schedule: ' + data.message);
      }
    } catch (err) {
      console.error('Error creating schedule:', err);
      alert('Failed to create schedule');
    }
  };

  const handleBulkCreate = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!selectedBatch || !bulkStartTime || !bulkEndTime) {
      alert('Please fill in batch and time fields');
      return;
    }

    if (bulkDates.length === 0) {
      alert('Select at least one date for this month');
      return;
    }

    const token = localStorage.getItem('token');
    let successCount = 0;
    let failureCount = 0;

    for (const date of bulkDates) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/class-schedules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            batchId: selectedBatch,
            date,
            startTime: bulkStartTime,
            endTime: bulkEndTime,
            topic: bulkTopic,
            location: bulkLocation,
          }),
        });

        const data = await response.json();
        if (data.success) {
          successCount += 1;
        } else {
          failureCount += 1;
        }
      } catch (err) {
        failureCount += 1;
        console.error('Error creating bulk schedule:', err);
      }
    }

    fetchSchedules();
    setStatusMessage(
      `Created ${successCount} class${successCount === 1 ? '' : 'es'} for ${bulkMonth}. ${
        failureCount ? `${failureCount} failed.` : ''
      }`
    );
    setView('calendar');
  };

  const handleToggleDateSelection = (date) => {
    if (bulkDates.includes(date)) {
      setBulkDates(bulkDates.filter((d) => d !== date));
    } else {
      setBulkDates([...bulkDates, date]);
    }
  };

  const handleSelectAllDates = () => {
    setBulkDates(getDatesForMonth(bulkMonth));
  };

  const handleSelectWeekdays = () => {
    autoSelectWeekdaysForMonth();
  };

  const handleClearDates = () => {
    setBulkDates([]);
  };

  const handleTogglePublish = async (scheduleId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/class-schedules/${scheduleId}/publish`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchSchedules();
      } else {
        alert('Failed to update: ' + data.message);
      }
    } catch (err) {
      console.error('Error toggling publish:', err);
      alert('Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/class-schedules/${scheduleId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Schedule deleted successfully');
        fetchSchedules();
      } else {
        alert('Failed to delete: ' + data.message);
      }
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Failed to delete schedule');
    }
  };

  const handleStartEdit = (schedule) => {
    setEditingId(schedule._id);
    setEditDate(new Date(schedule.date).toISOString().split('T')[0]);
    setEditStartTime(schedule.startTime);
    setEditEndTime(schedule.endTime);
  };

  const handleCancelEdit = () => {
    setEditingId('');
    setEditDate('');
    setEditStartTime('');
    setEditEndTime('');
  };

  const handleSaveEdit = async (scheduleId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/class-schedules/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: editDate,
          startTime: editStartTime,
          endTime: editEndTime,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Schedule updated');
        handleCancelEdit();
        fetchSchedules();
      } else {
        alert('Failed to update: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating schedule:', err);
      alert('Failed to update schedule');
    }
  };

  const getUpcomingSchedules = () => {
    const now = new Date();
    return schedules
      .filter((s) => new Date(s.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 10);
  };

  const getPublishedCount = () => {
    return schedules.filter((s) => s.isPublished).length;
  };

  const groupSchedulesByDate = () => {
    const grouped = {};
    schedules.forEach((schedule) => {
      const dateKey = new Date(schedule.date).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(schedule);
    });
    return grouped;
  };

  if (loading) {
    return <div className="class-management-container"><div className="loading">Loading...</div></div>;
  }

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="class-management-container">
        <div className="cm-header">
          <h1>Class Management</h1>
          <Link to="/admin" className="btn-back">← Back</Link>
        </div>

        <div className="action-cards">
          <div className="cm-action-card" onClick={() => setView('create')}>
            <div className="card-icon">+</div>
            <h2>Create New Class</h2>
            <p>Schedule a new class session</p>
          </div>

          <div className="cm-action-card" onClick={() => setView('bulk')}>
            <div className="card-icon">🗓️</div>
            <h2>Schedule by Month</h2>
            <p>Pick a batch and auto-add all dates for a month</p>
          </div>

          <div className="cm-action-card" onClick={() => setView('calendar')}>
            <div className="card-icon">📅</div>
            <h2>View Calendar</h2>
            <p>See all scheduled classes</p>
          </div>
        </div>

        <div className="stats-cards">
          <div className="stat-card">
            <h3>{schedules.length}</h3>
            <p>Total Classes</p>
          </div>
          <div className="stat-card">
            <h3>{getPublishedCount()}</h3>
            <p>Published</p>
          </div>
          <div className="stat-card">
            <h3>{getUpcomingSchedules().length}</h3>
            <p>Upcoming</p>
          </div>
        </div>

        <div className="upcoming-section">
          <h2>Upcoming Classes</h2>
          {getUpcomingSchedules().length === 0 ? (
            <p className="no-data">No upcoming classes scheduled</p>
          ) : (
            <div className="upcoming-list">
              {getUpcomingSchedules().map((schedule) => (
                <div key={schedule._id} className="upcoming-item">
                  <div className="item-left">
                    <div className="date-badge">
                      {new Date(schedule.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="item-details">
                      <h4>{schedule.batch?.name} - {schedule.batch?.level}</h4>
                      <p>{schedule.startTime} - {schedule.endTime}</p>
                      {schedule.topic && <p className="topic">{schedule.topic}</p>}
                    </div>
                  </div>
                  <div className="item-right">
                    <span className={`status-badge ${schedule.isPublished ? 'published' : 'draft'}`}>
                      {schedule.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Bulk Scheduler View
  if (view === 'bulk') {
    const monthDates = getDatesForMonth(bulkMonth);

    return (
      <div className="class-management-container">
        <div className="cm-header">
          <h1>Batch Schedule Builder</h1>
          <button onClick={() => setView('dashboard')} className="btn-back">← Back</button>
        </div>

        <form onSubmit={handleBulkCreate} className="create-form bulk-form">
          <div className="form-group">
            <label>Select Batch *</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              required
            >
              <option value="">Choose a batch...</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name} ({batch.level}) - {batch.students.length} students
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Month *</label>
              <input
                type="month"
                value={bulkMonth}
                onChange={(e) => setBulkMonth(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                value={bulkStartTime}
                onChange={(e) => setBulkStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                value={bulkEndTime}
                onChange={(e) => setBulkEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Topic (Optional)</label>
            <input
              type="text"
              value={bulkTopic}
              onChange={(e) => setBulkTopic(e.target.value)}
              placeholder="e.g., Adavus focus week"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={bulkLocation}
              onChange={(e) => setBulkLocation(e.target.value)}
              placeholder="Main Studio"
            />
          </div>

          <div className="bulk-actions">
            <div className="date-actions">
              <button type="button" className="btn-chip" onClick={handleSelectAllDates}>
                Select all days
              </button>
              <button type="button" className="btn-chip" onClick={handleSelectWeekdays}>
                Weekdays only
              </button>
              <button type="button" className="btn-chip secondary" onClick={handleClearDates}>
                Clear dates
              </button>
            </div>
            <p className="helper-text">
              {bulkDates.length} date{bulkDates.length === 1 ? '' : 's'} selected for {bulkMonth}
            </p>
          </div>

          <div className="date-grid">
            {monthDates.map((date) => {
              const isSelected = bulkDates.includes(date);
              const weekday = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
              return (
                <label key={date} className={`date-pill ${isSelected ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleDateSelection(date)}
                  />
                  <span>{weekday} • {new Date(date).getDate()}</span>
                </label>
              );
            })}
          </div>

          <button type="submit" className="btn-submit">
            Create {bulkDates.length} Class{bulkDates.length === 1 ? '' : 'es'}
          </button>

          {statusMessage && <div className="status-message">{statusMessage}</div>}
        </form>
      </div>
    );
  }

  // Create Class View
  if (view === 'create') {
    return (
      <div className="class-management-container">
        <div className="cm-header">
          <h1>Create New Class</h1>
          <button onClick={() => setView('dashboard')} className="btn-back">← Back</button>
        </div>

        <form onSubmit={handleCreateSchedule} className="create-form">
          <div className="form-group">
            <label>Select Batch *</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              required
            >
              <option value="">Choose a batch...</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name} ({batch.level}) - {batch.students.length} students
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time *</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Topic (Optional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Bharatanatyam basics"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Main Studio"
            />
          </div>

          <button type="submit" className="btn-submit">
            Create Class Schedule
          </button>
        </form>
      </div>
    );
  }

  // Calendar View
  if (view === 'calendar') {
    const groupedSchedules = groupSchedulesByDate();
    const sortedDates = Object.keys(groupedSchedules).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return (
      <div className="class-management-container">
        <div className="cm-header">
          <h1>Class Calendar</h1>
          <button onClick={() => setView('dashboard')} className="btn-back">← Back</button>
        </div>

        <div className="calendar-view">
          {sortedDates.length === 0 ? (
            <p className="no-data">No classes scheduled yet</p>
          ) : (
            sortedDates.map((dateKey) => (
              <div key={dateKey} className="calendar-day">
                <div className="day-header">
                  <h3>{dateKey}</h3>
                </div>
                <div className="day-classes">
                  {groupedSchedules[dateKey].map((schedule) => (
                    <div key={schedule._id} className="class-card">
                      <div className="class-header">
                        <h4>{schedule.batch?.name} - {schedule.batch?.level}</h4>
                        <span className={`status-badge ${schedule.isPublished ? 'published' : 'draft'}`}>
                          {schedule.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="class-info">
                        <p><strong>Time:</strong> {schedule.startTime} - {schedule.endTime}</p>
                        {schedule.topic && <p><strong>Topic:</strong> {schedule.topic}</p>}
                        <p><strong>Location:</strong> {schedule.location}</p>
                        <p><strong>Students:</strong> {schedule.batch?.students?.length || 0}</p>
                      </div>
                      <div className="class-actions">
                        <button
                          onClick={() => handleTogglePublish(schedule._id, schedule.isPublished)}
                          className={`btn-action ${schedule.isPublished ? 'unpublish' : 'publish'}`}
                        >
                          {schedule.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleStartEdit(schedule)}
                          className="btn-action publish"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule._id)}
                          className="btn-action delete"
                        >
                          Delete
                        </button>
                      </div>
                      {editingId === schedule._id && (
                        <div className="edit-row">
                          <div className="form-row">
                            <div className="form-group">
                              <label>New Date</label>
                              <input
                                type="date"
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>Start Time</label>
                              <input
                                type="time"
                                value={editStartTime}
                                onChange={(e) => setEditStartTime(e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label>End Time</label>
                              <input
                                type="time"
                                value={editEndTime}
                                onChange={(e) => setEditEndTime(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="edit-actions">
                            <button
                              type="button"
                              className="btn-chip"
                              onClick={() => handleSaveEdit(schedule._id)}
                            >
                              Save changes
                            </button>
                            <button
                              type="button"
                              className="btn-chip secondary"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default ClassManagement;
