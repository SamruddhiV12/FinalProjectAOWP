import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function AdminDashboard() {
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
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <span className="header-date">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="header-right">
          <span className="header-time">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-bar">
        <div className="stat-item stat-primary">
          <p className="stat-label">Total Students</p>
          <p className="stat-value">45</p>
        </div>

        <div className="stat-item stat-secondary">
          <p className="stat-label">Active Batches</p>
          <p className="stat-value">3</p>
        </div>

        <div className="stat-item stat-warning">
          <p className="stat-label">Pending Reviews</p>
          <p className="stat-value">8</p>
        </div>

        <div className="stat-item stat-success">
          <p className="stat-label">Avg Attendance</p>
          <p className="stat-value">87%</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="actions-section">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/students-list" className="action-card">
              <span className="action-card-icon">👥</span>
              <h3 className="action-card-title">Students</h3>
              <p className="action-card-desc">View and manage students</p>
            </Link>

            <Link to="/batches" className="action-card">
              <span className="action-card-icon">📚</span>
              <h3 className="action-card-title">Batches</h3>
              <p className="action-card-desc">Create and manage batches</p>
            </Link>

            <Link to="/attendance" className="action-card">
              <span className="action-card-icon">📝</span>
              <h3 className="action-card-title">Attendance</h3>
              <p className="action-card-desc">Mark today's attendance</p>
            </Link>

            <Link to="/classes" className="action-card">
              <span className="action-card-icon">🗓️</span>
              <h3 className="action-card-title">Schedule</h3>
              <p className="action-card-desc">Manage class schedules</p>
            </Link>

            <Link to="/admin/materials" className="action-card">
              <span className="action-card-icon">📖</span>
              <h3 className="action-card-title">Materials</h3>
              <p className="action-card-desc">Upload study content</p>
            </Link>

            <Link to="/review" className="action-card">
              <span className="action-card-icon">✍️</span>
              <h3 className="action-card-title">Reviews</h3>
              <p className="action-card-desc">Grade submissions</p>
              <span className="action-badge">8 New</span>
            </Link>

            <Link to="/admin/payments" className="action-card">
              <span className="action-card-icon">💰</span>
              <h3 className="action-card-title">Payments</h3>
              <p className="action-card-desc">Track fee collections</p>
            </Link>

            <Link to="/admin/notifications" className="action-card">
              <span className="action-card-icon">📢</span>
              <h3 className="action-card-title">Notify</h3>
              <p className="action-card-desc">Send announcements</p>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {/* Today's Schedule */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">📅 Today's Classes</h3>
            <div className="notification-item">
              <p className="notification-title">Basic Batch</p>
              <p className="notification-text">4:00 PM - 5:00 PM</p>
              <p className="notification-text">👥 8 students</p>
            </div>
            <div className="notification-item">
              <p className="notification-title">Intermediate Batch</p>
              <p className="notification-text">5:00 PM - 6:30 PM</p>
              <p className="notification-text">👥 12 students</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">🕐 Recent Activity</h3>
            <div className="notification-item">
              <p className="notification-title">New Submission</p>
              <p className="notification-text">Priya submitted Adavu Sequence</p>
              <span className="notification-time">2 hours ago</span>
            </div>
            <div className="notification-item">
              <p className="notification-title">Payment Received</p>
              <p className="notification-text">Ananya paid Nov fees (₹3,000)</p>
              <span className="notification-time">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* This Week's Schedule */}
      <div className="full-width-section">
        <div className="section-header">
          <h2 className="section-title">📅 This Week's Schedule</h2>
          <Link to="/classes" className="view-all-btn">View Full Calendar</Link>
        </div>
        <div className="content-grid">
          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge">Basic</span>
            </div>
            <h3 className="content-title">Fundamentals & Practice</h3>
            <p className="content-desc">Monday & Wednesday, 4:00 PM - 5:00 PM</p>
            <div className="content-meta">
              <span>👥 8 students</span>
              <span>📍 Main Studio</span>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge">Intermediate</span>
            </div>
            <h3 className="content-title">Advanced Techniques</h3>
            <p className="content-desc">Monday & Wednesday, 5:00 PM - 6:30 PM</p>
            <div className="content-meta">
              <span>👥 12 students</span>
              <span>📍 Main Studio</span>
            </div>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge">Advanced</span>
            </div>
            <h3 className="content-title">Performance Ready</h3>
            <p className="content-desc">Monday & Wednesday, 6:30 PM - 8:00 PM</p>
            <div className="content-meta">
              <span>👥 6 students</span>
              <span>📍 Main Studio</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="full-width-section">
        <h2 className="section-title">⏳ Pending Tasks</h2>
        <div className="content-grid">
          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge pending">8 Pending</span>
            </div>
            <h3 className="content-title">Assignment Reviews</h3>
            <p className="content-desc">
              Student submissions waiting for your feedback and grading
            </p>
            <Link to="/review" className="content-action">Review Now</Link>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge pending">5 Students</span>
            </div>
            <h3 className="content-title">Payment Follow-ups</h3>
            <p className="content-desc">
              Students with pending fee payments for this month
            </p>
            <Link to="/admin/payments" className="content-action">View Details</Link>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge">Upcoming</span>
            </div>
            <h3 className="content-title">Annual Day Preparations</h3>
            <p className="content-desc">
              Coordinate costumes, rehearsals, and performance schedule
            </p>
            <Link to="/classes" className="content-action">Plan Event</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
