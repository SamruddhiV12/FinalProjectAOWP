import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/BatchManagement.css';

function BatchManagement() {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const [newBatch, setNewBatch] = useState({
    name: '',
    level: 'basic',
    days: [],
    startTime: '',
    endTime: '',
    instructor: '',
    maxStudents: 15,
    description: '',
  });

  const [stats, setStats] = useState({
    totalBatches: 0,
    basic: 0,
    intermediate: 0,
    advanced: 0,
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchBatches();
    fetchStudents();
    fetchTeachers();
  }, []);

  useEffect(() => {
    updateStats();
  }, [batches]);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/batches`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBatches(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch batches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStudents(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setTeachers([data.data]);
      }
    } catch (err) {
      console.error('Failed to fetch teachers:', err);
    }
  };

  const updateStats = () => {
    const activeBatches = batches.filter((b) => b.isActive);
    setStats({
      totalBatches: activeBatches.length,
      basic: activeBatches.filter((b) => b.level === 'basic').length,
      intermediate: activeBatches.filter((b) => b.level === 'intermediate').length,
      advanced: activeBatches.filter((b) => b.level === 'advanced').length,
    });
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();

    if (newBatch.days.length === 0) {
      alert('Please select at least one day');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newBatch.name,
          level: newBatch.level,
          schedule: {
            days: newBatch.days,
            startTime: newBatch.startTime,
            endTime: newBatch.endTime,
          },
          instructor: newBatch.instructor,
          maxStudents: parseInt(newBatch.maxStudents),
          description: newBatch.description,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Batch created successfully!');
        setShowCreateModal(false);
        setNewBatch({
          name: '',
          level: 'basic',
          days: [],
          startTime: '',
          endTime: '',
          instructor: '',
          maxStudents: 15,
          description: '',
        });
        fetchBatches();
      } else {
        alert('Failed to create batch: ' + data.message);
      }
    } catch (err) {
      console.error('Error creating batch:', err);
      alert('Failed to create batch');
    }
  };

  const handleDayToggle = (day) => {
    setNewBatch((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleAddStudent = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/batches/${selectedBatch._id}/students`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ studentId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Student added to batch successfully!');
        fetchBatches();
        setShowAddStudentModal(false);
        setSelectedBatch(null);
      } else {
        alert('Failed to add student: ' + data.message);
      }
    } catch (err) {
      console.error('Error adding student:', err);
      alert('Failed to add student');
    }
  };

  const handleRemoveStudent = async (batchId, studentId) => {
    if (!window.confirm('Are you sure you want to remove this student from the batch?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/batches/${batchId}/students/${studentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Student removed successfully!');
        fetchBatches();
      } else {
        alert('Failed to remove student: ' + data.message);
      }
    } catch (err) {
      console.error('Error removing student:', err);
      alert('Failed to remove student');
    }
  };

  const filteredBatches =
    selectedLevel === 'all'
      ? batches
      : batches.filter((batch) => batch.level === selectedLevel);

  const getAvailableStudents = () => {
    if (!selectedBatch) return [];
    const batchStudentIds = selectedBatch.students.map((s) => s._id);
    return students.filter(
      (student) => !batchStudentIds.includes(student._id)
    );
  };

  if (loading) {
    return (
      <div className="batch-management-container">
        <div className="loading">Loading batches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="batch-management-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="batch-management-container">
      <div className="batch-header">
        <h1>Batch Management</h1>
        <div className="header-actions">
          <button
            className="btn-create-batch"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Batch
          </button>
          <Link to="/admin" className="btn-back">
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <h3>{stats.totalBatches}</h3>
          <p>Total Batches</p>
        </div>
        <div className="stat-card basic">
          <h3>{stats.basic}</h3>
          <p>Basic Level</p>
        </div>
        <div className="stat-card intermediate">
          <h3>{stats.intermediate}</h3>
          <p>Intermediate Level</p>
        </div>
        <div className="stat-card advanced">
          <h3>{stats.advanced}</h3>
          <p>Advanced Level</p>
        </div>
      </div>

      <div className="batch-filters">
        <button
          className={selectedLevel === 'all' ? 'active' : ''}
          onClick={() => setSelectedLevel('all')}
        >
          All Batches
        </button>
        <button
          className={selectedLevel === 'basic' ? 'active' : ''}
          onClick={() => setSelectedLevel('basic')}
        >
          Basic
        </button>
        <button
          className={selectedLevel === 'intermediate' ? 'active' : ''}
          onClick={() => setSelectedLevel('intermediate')}
        >
          Intermediate
        </button>
        <button
          className={selectedLevel === 'advanced' ? 'active' : ''}
          onClick={() => setSelectedLevel('advanced')}
        >
          Advanced
        </button>
      </div>

      <div className="batches-grid">
        {filteredBatches.length === 0 ? (
          <div className="no-batches">No batches found. Create one to get started!</div>
        ) : (
          filteredBatches.map((batch) => (
            <div key={batch._id} className="batch-card">
              <div className="batch-card-header">
                <h3>{batch.name}</h3>
                <span className={`level-badge ${batch.level}`}>
                  {batch.level}
                </span>
              </div>

              <div className="batch-info">
                <div className="info-row">
                  <span className="label">Instructor:</span>
                  <span className="value">
                    {batch.instructor
                      ? `${batch.instructor.firstName} ${batch.instructor.lastName}`
                      : 'N/A'}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Schedule:</span>
                  <span className="value">
                    {batch.schedule.days.join(', ')}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Time:</span>
                  <span className="value">
                    {batch.schedule.startTime} - {batch.schedule.endTime}
                  </span>
                </div>

                <div className="info-row">
                  <span className="label">Enrollment:</span>
                  <span className="value">
                    {batch.students.length} / {batch.maxStudents} students
                  </span>
                </div>
              </div>

              <div className="batch-students">
                <h4>Students ({batch.students.length})</h4>
                {batch.students.length === 0 ? (
                  <p className="no-students">No students enrolled yet</p>
                ) : (
                  <ul>
                    {batch.students.map((student) => (
                      <li key={student._id}>
                        <span>
                          {student.firstName} {student.lastName}
                        </span>
                        <button
                          className="btn-remove-student"
                          onClick={() =>
                            handleRemoveStudent(batch._id, student._id)
                          }
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="batch-actions">
                <button
                  className="btn-add-student"
                  onClick={() => {
                    setSelectedBatch(batch);
                    setShowAddStudentModal(true);
                  }}
                  disabled={batch.students.length >= batch.maxStudents}
                >
                  + Add Student
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Batch</h2>
              <button
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div className="form-group">
                <label>Batch Name *</label>
                <input
                  type="text"
                  value={newBatch.name}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Level *</label>
                <select
                  value={newBatch.level}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, level: e.target.value })
                  }
                  required
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Days *</label>
                <div className="days-selection">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newBatch.days.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                      {day.slice(0, 3)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    value={newBatch.startTime}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, startTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    value={newBatch.endTime}
                    onChange={(e) =>
                      setNewBatch({ ...newBatch, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Instructor *</label>
                <select
                  value={newBatch.instructor}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, instructor: e.target.value })
                  }
                  required
                >
                  <option value="">Select Instructor</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.firstName} {teacher.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Max Students</label>
                <input
                  type="number"
                  value={newBatch.maxStudents}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, maxStudents: e.target.value })
                  }
                  min="5"
                  max="30"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newBatch.description}
                  onChange={(e) =>
                    setNewBatch({ ...newBatch, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-submit">
                  Create Batch
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && selectedBatch && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Student to {selectedBatch.name}</h2>
              <button
                className="btn-close"
                onClick={() => {
                  setShowAddStudentModal(false);
                  setSelectedBatch(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="student-list">
              {getAvailableStudents().length === 0 ? (
                <p className="no-students">
                  No available students to add to this batch
                </p>
              ) : (
                <ul>
                  {getAvailableStudents().map((student) => (
                    <li key={student._id} className="student-item">
                      <div className="student-details">
                        <span className="student-name">
                          {student.firstName} {student.lastName}
                        </span>
                        <span className="student-email">{student.email}</span>
                      </div>
                      <button
                        className="btn-add"
                        onClick={() => handleAddStudent(student._id)}
                      >
                        Add
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchManagement;
