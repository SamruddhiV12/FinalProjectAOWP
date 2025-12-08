import React, { useState, useEffect } from 'react';
import '../styles/Attendance.css';

function Attendance({ user, onBack }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState({});
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [existingAttendance, setExistingAttendance] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch && selectedDate) {
      checkExistingAttendance();
    }
  }, [selectedBatch, selectedDate]);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/batches', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const activeBatches = data.data.filter((b) => b.isActive);
        setBatches(activeBatches);
        if (activeBatches.length > 0) {
          setSelectedBatch(activeBatches[0]);
          initializeAttendance(activeBatches[0]);
        }
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

  const checkExistingAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5001/api/attendance?batchId=${selectedBatch._id}&startDate=${selectedDate}&endDate=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data.length > 0) {
        const existingRecord = data.data[0];
        setExistingAttendance(existingRecord);

        // Populate attendance state from existing record
        const attendanceMap = {};
        existingRecord.records.forEach((record) => {
          attendanceMap[record.student._id] = record.status;
        });
        setAttendance(attendanceMap);
        setTopic(existingRecord.topic || '');
        setDuration(existingRecord.duration || 60);
      } else {
        setExistingAttendance(null);
        initializeAttendance(selectedBatch);
      }
    } catch (err) {
      console.error('Error checking existing attendance:', err);
    }
  };

  const initializeAttendance = (batch) => {
    if (!batch) return;

    const initialAttendance = {};
    batch.students.forEach((student) => {
      initialAttendance[student._id] = 'absent';
    });
    setAttendance(initialAttendance);
  };

  const handleBatchChange = (batchId) => {
    const batch = batches.find((b) => b._id === batchId);
    setSelectedBatch(batch);
    initializeAttendance(batch);
    setExistingAttendance(null);
  };

  const toggleAttendance = (studentId) => {
    setAttendance((prev) => {
      const currentStatus = prev[studentId] || 'absent';
      let newStatus;

      // Cycle through: absent -> present -> late -> excused -> absent
      switch (currentStatus) {
        case 'absent':
          newStatus = 'present';
          break;
        case 'present':
          newStatus = 'late';
          break;
        case 'late':
          newStatus = 'excused';
          break;
        case 'excused':
          newStatus = 'absent';
          break;
        default:
          newStatus = 'present';
      }

      return { ...prev, [studentId]: newStatus };
    });
  };

  const markAllPresent = () => {
    const allPresent = {};
    selectedBatch.students.forEach((student) => {
      allPresent[student._id] = 'present';
    });
    setAttendance(allPresent);
  };

  const clearAll = () => {
    const allAbsent = {};
    selectedBatch.students.forEach((student) => {
      allAbsent[student._id] = 'absent';
    });
    setAttendance(allAbsent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBatch) {
      alert('Please select a batch');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const records = selectedBatch.students.map((student) => ({
        student: student._id,
        status: attendance[student._id] || 'absent',
        notes: '',
      }));

      const response = await fetch('http://localhost:5001/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          batchId: selectedBatch._id,
          date: selectedDate,
          records,
          topic,
          duration: parseInt(duration),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          existingAttendance
            ? 'Attendance updated successfully!'
            : 'Attendance saved successfully!'
        );
        checkExistingAttendance();
      } else {
        alert('Failed to save attendance: ' + data.message);
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      alert('Failed to save attendance');
    }
  };

  const getStatusCounts = () => {
    const counts = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
    };

    Object.values(attendance).forEach((status) => {
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'status-present';
      case 'absent':
        return 'status-absent';
      case 'late':
        return 'status-late';
      case 'excused':
        return 'status-excused';
      default:
        return 'status-absent';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return '✓';
      case 'absent':
        return '✗';
      case 'late':
        return '⏰';
      case 'excused':
        return '📝';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="attendance-container">
        <div className="loading">Loading batches...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="attendance-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (batches.length === 0) {
    return (
      <div className="attendance-container">
        <div className="attendance-header">
          <h1>Mark Attendance</h1>
          <button onClick={onBack} className="btn-back">
            ← Back
          </button>
        </div>
        <div className="no-batches">
          <h2>No batches found</h2>
          <p>Please create a batch first to mark attendance.</p>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const totalStudents = selectedBatch ? selectedBatch.students.length : 0;

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Mark Attendance</h1>
        <button onClick={onBack} className="btn-back">
          ← Back
        </button>
      </div>

      {existingAttendance && (
        <div className="info-banner">
          Attendance already exists for this date. You can update it.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Select Date *</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Select Batch *</label>
              <select
                value={selectedBatch ? selectedBatch._id : ''}
                onChange={(e) => handleBatchChange(e.target.value)}
                required
              >
                {batches.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name} ({batch.level}) - {batch.students.length}{' '}
                    students
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
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
              <label>Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="15"
                max="180"
              />
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <button type="button" onClick={markAllPresent} className="btn-action">
            ✓ Mark All Present
          </button>
          <button type="button" onClick={clearAll} className="btn-action secondary">
            ✗ Clear All
          </button>
        </div>

        <div className="batch-info-card">
          <h2>
            {selectedBatch?.name} - {totalStudents} Students
          </h2>
          <p className="batch-schedule">
            {selectedBatch?.schedule.days.join(', ')} |{' '}
            {selectedBatch?.schedule.startTime} -{' '}
            {selectedBatch?.schedule.endTime}
          </p>
          <p className="instruction">
            Click on each student card to cycle through: Present → Late →
            Excused → Absent
          </p>
        </div>

        <div className="students-grid">
          {selectedBatch?.students.map((student) => (
            <div
              key={student._id}
              className={`student-card ${getStatusColor(
                attendance[student._id]
              )}`}
              onClick={() => toggleAttendance(student._id)}
            >
              <div className="status-icon">
                {getStatusIcon(attendance[student._id])}
              </div>
              <h3>
                {student.firstName} {student.lastName}
              </h3>
              <p className="status-text">{attendance[student._id] || 'absent'}</p>
            </div>
          ))}
        </div>

        <div className="summary-section">
          <h3>Summary</h3>
          <div className="summary-grid">
            <div className="summary-card present">
              <div className="count">{statusCounts.present}</div>
              <div className="label">Present</div>
            </div>
            <div className="summary-card absent">
              <div className="count">{statusCounts.absent}</div>
              <div className="label">Absent</div>
            </div>
            <div className="summary-card late">
              <div className="count">{statusCounts.late}</div>
              <div className="label">Late</div>
            </div>
            <div className="summary-card excused">
              <div className="count">{statusCounts.excused}</div>
              <div className="label">Excused</div>
            </div>
          </div>
          <div className="percentage">
            Attendance Rate:{' '}
            {totalStudents > 0
              ? Math.round(
                  ((statusCounts.present + statusCounts.late) / totalStudents) *
                    100
                )
              : 0}
            %
          </div>
        </div>

        <button type="submit" className="btn-submit">
          {existingAttendance ? 'Update Attendance' : 'Save Attendance'}
        </button>
      </form>
    </div>
  );
}

export default Attendance;
