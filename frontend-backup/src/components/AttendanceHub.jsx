import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Attendance from './Attendance';
import '../styles/AttendanceHub.css';

function AttendanceHub({ user }) {
  const [currentView, setCurrentView] = useState('hub');

  if (currentView === 'mark-attendance') {
    return (
      <div>
        <Attendance user={user} onBack={() => setCurrentView('hub')} />
      </div>
    );
  }

  return (
    <div className="attendance-hub-container">
      <div className="hub-header">
        <h1>Attendance Management</h1>
        <Link to="/admin" className="btn-back">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="hub-actions">
        <div className="action-card-large" onClick={() => setCurrentView('mark-attendance')}>
          <div className="action-icon-large">✓</div>
          <h2>Mark Attendance</h2>
          <p>Select a batch and mark student attendance for today or any date</p>
          <button className="btn-primary">Start Marking</button>
        </div>

        <Link to="/batches" className="action-card-large">
          <div className="action-icon-large">📚</div>
          <h2>Manage Batches</h2>
          <p>Create new batches, add students, and organize classes</p>
          <button className="btn-primary">Manage Batches</button>
        </Link>

        <div className="action-card-large disabled">
          <div className="action-icon-large">📊</div>
          <h2>View Reports</h2>
          <p>See attendance statistics and student performance reports</p>
          <button className="btn-primary" disabled>Coming Soon</button>
        </div>
      </div>

      <div className="hub-info">
        <h3>Quick Guide</h3>
        <ul>
          <li>
            <strong>First time?</strong> Create batches and add students before marking attendance
          </li>
          <li>
            <strong>Mark Attendance:</strong> Select batch, date, and click on each student to mark their status
          </li>
          <li>
            <strong>Student Status:</strong> Present, Absent, Late, or Excused
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AttendanceHub;
