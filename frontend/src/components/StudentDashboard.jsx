import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-page">
      {/* Compact Header Bar */}
      <div className="dashboard-header-bar">
        <div className="header-left">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <span className="header-date">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="header-right">
          <span className="header-time">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-bar">
        <div className="stat-item stat-success">
          <p className="stat-label">Attendance Rate</p>
          <p className="stat-value">85%</p>
        </div>

        <div className="stat-item stat-primary">
          <p className="stat-label">Completed Tasks</p>
          <p className="stat-value">12</p>
        </div>

        <div className="stat-item stat-warning">
          <p className="stat-label">Pending Tasks</p>
          <p className="stat-value">3</p>
        </div>

        <div className="stat-item stat-secondary">
          <p className="stat-label">Average Score</p>
          <p className="stat-value">4.2/5</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="actions-section">
          <div className="actions-grid">
            <Link to="/student-schedule" className="action-card">
              <span className="action-card-icon">📅</span>
              <h3 className="action-card-title">Class Schedule</h3>
              <p className="action-card-desc">View your upcoming classes</p>
            </Link>

            <Link to="/materials" className="action-card">
              <span className="action-card-icon">📚</span>
              <h3 className="action-card-title">Study Materials</h3>
              <p className="action-card-desc">Access videos and notes</p>
            </Link>

            <Link to="/assignment/1" className="action-card">
              <span className="action-card-icon">📝</span>
              <h3 className="action-card-title">Submit Assignment</h3>
              <p className="action-card-desc">Complete pending tasks</p>
              <span className="action-badge">3 Pending</span>
            </Link>

            <Link to="/exam/1" className="action-card">
              <span className="action-card-icon">🎯</span>
              <h3 className="action-card-title">Practice Exam</h3>
              <p className="action-card-desc">Test your knowledge</p>
            </Link>

            <Link to="/student-profile" className="action-card">
              <span className="action-card-icon">👤</span>
              <h3 className="action-card-title">My Profile</h3>
              <p className="action-card-desc">View and edit your profile</p>
            </Link>

            <Link to="/exam-records" className="action-card">
              <span className="action-card-icon">📊</span>
              <h3 className="action-card-title">Exam Records</h3>
              <p className="action-card-desc">View your exam history</p>
            </Link>

            <Link to="/progress" className="action-card">
              <span className="action-card-icon">📈</span>
              <h3 className="action-card-title">My Progress</h3>
              <p className="action-card-desc">Track your performance</p>
            </Link>

            <Link to="/payments" className="action-card">
              <span className="action-card-icon">💳</span>
              <h3 className="action-card-title">Payments</h3>
              <p className="action-card-desc">View fee status</p>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {/* Upcoming Classes */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">🗓️ Next Class</h3>
            <div className="notification-item">
              <p className="notification-title">Intermediate Batch Practice</p>
              <p className="notification-text">Monday, 5:00 PM - 6:30 PM</p>
              <p className="notification-text">📍 Main Studio</p>
              <span className="notification-time">Tomorrow</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">📢 Notifications</h3>
            <div className="notification-item">
              <p className="notification-title">New Assignment Posted</p>
              <p className="notification-text">Submit Adavu Sequence by Nov 20</p>
              <span className="notification-time">2 hours ago</span>
            </div>
            <div className="notification-item">
              <p className="notification-title">Payment Reminder</p>
              <p className="notification-text">December fees due on Dec 5</p>
              <span className="notification-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="full-width-section">
        <div className="section-header">
          <h2 className="section-title">💬 Recent Feedback</h2>
          <Link to="/progress" className="view-all-btn">View All</Link>
        </div>
        <div className="content-grid">
          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge">⭐ 4.5/5</span>
            </div>
            <h3 className="content-title">Alarippu Performance</h3>
            <p className="content-desc">
              Excellent rhythm and footwork! Your tala accuracy has improved significantly.
            </p>
            <div className="content-meta">
              <span>📅 Nov 8, 2025</span>
              <span>👤 Teacher: Samruddhi</span>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge">⭐ 4.0/5</span>
            </div>
            <h3 className="content-title">Jatiswaram Practice</h3>
            <p className="content-desc">
              Good progress on rhythmic patterns. Focus more on hand movements coordination.
            </p>
            <div className="content-meta">
              <span>📅 Nov 5, 2025</span>
              <span>👤 Teacher: Samruddhi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="full-width-section">
        <h2 className="section-title">📣 Announcements</h2>
        <div className="content-grid">
          <div className="content-card">
            <h3 className="content-title">Annual Day Performance - Dec 15th</h3>
            <p className="content-desc">
              Start practicing your group pieces. Costume measurements next week!
            </p>
            <div className="content-meta">
              <span>📅 Posted 2 days ago</span>
            </div>
          </div>

          <div className="content-card">
            <h3 className="content-title">Workshop on Abhinaya - Nov 18th</h3>
            <p className="content-desc">
              Special session on facial expressions and emotions. All batches welcome!
            </p>
            <div className="content-meta">
              <span>📅 Posted 1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
