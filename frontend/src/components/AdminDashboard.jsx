import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    students: 0,
    batches: 0,
    pendingReviews: 0,
    pendingPayments: 0,
    avgAttendance: '-',
  });
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const start = new Date();
      start.setDate(start.getDate() - start.getDay()); // start of week (Sunday)
      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      const [studentsRes, batchesRes, paymentsRes, reviewsRes, scheduleRes, tasksRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/students`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/batches`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/payments?status=pending`, config),
        axios.get(`${process.env.REACT_APP_API_URL}/api/assignments/pending/reviews`, config),
        axios.get(
          `${process.env.REACT_APP_API_URL}/api/class-schedules?startDate=${start.toISOString()}&endDate=${end.toISOString()}&published=true`,
          config
        ),
        axios.get(`${process.env.REACT_APP_API_URL}/api/tasks?status=pending`, config),
      ]);

      setStats({
        students: studentsRes.data?.count || 0,
        batches: batchesRes.data?.count || 0,
        pendingReviews: reviewsRes.data?.count || 0,
        pendingPayments: paymentsRes.data?.count || 0,
        avgAttendance: '-', // Placeholder; needs separate aggregation if desired
      });

      setWeeklySchedule(scheduleRes.data?.data || []);
      setPendingTasks(tasksRes.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Admin dashboard fetch error:', err);
      setError('Failed to load live data');
      setLoading(false);
    }
  };

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
          <p className="stat-value">{loading ? '...' : stats.students}</p>
        </div>

        <div className="stat-item stat-secondary">
          <p className="stat-label">Active Batches</p>
          <p className="stat-value">{loading ? '...' : stats.batches}</p>
        </div>

        <div className="stat-item stat-success">
          <p className="stat-label">Pending Payments</p>
          <p className="stat-value">{loading ? '...' : stats.pendingPayments}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/students-list" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="action-card-title">Students</h3>
              <p className="action-card-desc">View and manage students</p>
            </Link>

            <Link to="/batches" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h3 className="action-card-title">Batches</h3>
              <p className="action-card-desc">Create and manage batches</p>
            </Link>

            <Link to="/attendance" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="action-card-title">Attendance</h3>
              <p className="action-card-desc">Mark today's attendance</p>
            </Link>

            <Link to="/classes" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="action-card-title">Schedule</h3>
              <p className="action-card-desc">Manage class schedules</p>
            </Link>

            <Link to="/admin/materials" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <h3 className="action-card-title">Materials</h3>
              <p className="action-card-desc">Upload study content</p>
            </Link>

            <Link to="/admin/payments" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <h3 className="action-card-title">Payments</h3>
              <p className="action-card-desc">Track fee collections</p>
            </Link>

            <Link to="/admin/notifications" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <h3 className="action-card-title">Notify</h3>
              <p className="action-card-desc">Send announcements</p>
            </Link>

            <Link to="/admin/tasks" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3 className="action-card-title">Tasks</h3>
              <p className="action-card-desc">Create and track pending items</p>
            </Link>

            <Link to="/admin/feedback" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="7"/>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                </svg>
              </div>
              <h3 className="action-card-title">Feedback</h3>
              <p className="action-card-desc">Send feedback to students</p>
            </Link>
          </div>
        </div>

      {/* Sidebar */}
        <div className="sidebar-section">
          {/* Today's Schedule */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Today's Classes</h3>
            {weeklySchedule
              .filter(cls => {
                const today = new Date();
                const classDate = new Date(cls.date);
                return (
                  today.toDateString() === classDate.toDateString()
                );
              })
              .slice(0, 3)
              .map(cls => (
                <div key={cls._id} className="notification-item">
                  <p className="notification-title">{cls.batch?.name || 'Class'}</p>
                  <p className="notification-text">{cls.startTime} - {cls.endTime}</p>
                  <p className="notification-text">{cls.batch?.students?.length ?? '—'} students</p>
                </div>
              ))}
            {weeklySchedule.filter(cls => {
              const today = new Date();
              return today.toDateString() === new Date(cls.date).toDateString();
            }).length === 0 && (
              <div className="notification-item">
                <p className="notification-text">No classes scheduled today.</p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Recent Activity</h3>
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
          <h2 className="section-title">This Week's Schedule</h2>
          <Link to="/classes" className="view-all-btn">View Full Calendar</Link>
        </div>
        <div className="content-grid">
          {weeklySchedule.length === 0 ? (
            <div style={{ padding: '1rem', color: '#6B6B6B' }}>No classes scheduled this week.</div>
          ) : (
            weeklySchedule.map((cls) => (
              <div key={cls._id} className="content-card">
                <div className="content-card-header">
                  <span className="content-badge">{cls.batch?.level || 'Batch'}</span>
                </div>
                <h3 className="content-title">{cls.topic || cls.batch?.name || 'Class'}</h3>
                <p className="content-desc">
                  {new Date(cls.date).toLocaleDateString('en-US', { weekday: 'long' })},{' '}
                  {cls.startTime} - {cls.endTime}
                </p>
                <div className="content-meta">
                  <span>{cls.batch?.students?.length ?? '—'} students</span>
                  <span>{cls.location || 'Studio'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="full-width-section">
        <h2 className="section-title">Pending Tasks</h2>
        <div className="content-grid">
          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge pending">{loading ? '...' : `${stats.pendingPayments} Students`}</span>
            </div>
            <h3 className="content-title">Payment Follow-ups</h3>
            <p className="content-desc">
              Students with pending fee payments for this month
            </p>
            <Link to="/admin/payments" className="content-action">View Details</Link>
          </div>

          <div className="content-card">
            <div className="content-card-header">
              <span className="content-badge pending">
                {loading ? '...' : `${pendingTasks.length} Pending`}
              </span>
            </div>
            <h3 className="content-title">Admin Tasks</h3>
            <p className="content-desc">
              {pendingTasks.length === 0
                ? 'No pending tasks.'
                : pendingTasks.slice(0, 2).map((t) => t.title).join(' • ')}
            </p>
            <Link to="/admin/tasks" className="content-action">Manage Tasks</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
