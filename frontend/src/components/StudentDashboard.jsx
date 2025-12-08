import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    attendance: 0,
    classesAttended: 0,
    totalClasses: 0,
    assignmentsCompleted: 0,
    examsGiven: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [nextClass, setNextClass] = useState(null);
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
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch both but don't fail if one fails
      try {
        const statsRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/student-profile/stats`, config);
        if (statsRes.data.success) {
          setStats({
            attendance: statsRes.data.data?.attendance || 0,
            classesAttended: statsRes.data.data?.classesAttended || 0,
            totalClasses: statsRes.data.data?.totalClasses || 0,
            assignmentsCompleted: statsRes.data.data?.assignmentsCompleted || 0,
            examsGiven: statsRes.data.data?.examsGiven || 0
          });
        }
      } catch (statsErr) {
        console.log('Stats not available yet - student may not be assigned to batch');
        // Set empty stats for new students
        setStats({
          attendance: 0,
          classesAttended: 0,
          totalClasses: 0,
          assignmentsCompleted: 0,
          examsGiven: 0
        });
      }

      try {
        const notifRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, config);
        if (notifRes.data.success) {
          setNotifications(notifRes.data.data || []);
        }
      } catch (notifErr) {
        console.log('Notifications not available yet');
        setNotifications([]);
      }

      try {
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 14);
        const scheduleRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/class-schedules?startDate=${start.toISOString()}&endDate=${end.toISOString()}&published=true`,
          config
        );
        if (scheduleRes.data.success) {
          const now = new Date();
          const upcoming = (scheduleRes.data.data || [])
            .filter(cls => {
              const d = new Date(cls.date);
              return d >= now;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          setNextClass(upcoming[0] || null);
        }
      } catch (schedErr) {
        console.log('Schedule not available yet');
        setNextClass(null);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Don't show error for new students - just show empty state
      setError('Failed to load dashboard data');
      setStats({
        attendance: 0,
        classesAttended: 0,
        totalClasses: 0,
        assignmentsCompleted: 0,
        examsGiven: 0
      });
      setNotifications([]);
      setLoading(false);
    }
  };

  const isNewStudent = stats && stats.totalClasses === 0;

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

      {/* Welcome message for new students */}
      {isNewStudent && (
        <div style={{
          margin: '1.5rem 2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #fff9e6 0%, #fffdf7 100%)',
          border: '2px solid #C9A961',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#8B7355', marginBottom: '0.5rem' }}>Welcome to Samruddhi's Dance Academy!</h2>
          <p style={{ color: '#6B6B6B', fontSize: '1rem' }}>
            Your registration is complete. Our admin team will assign you to a batch soon.
            Once assigned, you'll see your class schedule, assignments, and progress here.
          </p>
          <p style={{ color: '#8B7355', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Please check back later or contact the academy for batch assignment.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="stats-bar">
        {loading ? (
          <div className="stat-item">
            <p className="stat-label">Loading...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="stat-item">
                <p className="stat-label" style={{ color: 'red' }}>{error} (showing available data)</p>
              </div>
            )}
            <div className="stat-item stat-success">
              <p className="stat-label">Attendance Rate</p>
              <p className="stat-value">{stats.attendance}%</p>
            </div>

            <div className="stat-item stat-primary">
              <p className="stat-label">Classes Attended</p>
              <p className="stat-value">{stats.classesAttended}/{stats.totalClasses}</p>
            </div>

            <div className="stat-item stat-warning">
              <p className="stat-label">Assignments Completed</p>
              <p className="stat-value">{stats.assignmentsCompleted}</p>
            </div>

            <div className="stat-item stat-secondary">
              <p className="stat-label">Exams Given</p>
              <p className="stat-value">{stats.examsGiven}</p>
            </div>
          </>
        )}
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="actions-section">
          <div className="actions-grid">
            <Link to="/student-schedule" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="action-card-title">Class Schedule</h3>
              <p className="action-card-desc">View your upcoming classes</p>
            </Link>

            <Link to="/materials" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <h3 className="action-card-title">Study Materials</h3>
              <p className="action-card-desc">Access videos and notes</p>
            </Link>

            <Link to="/exam/1" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <h3 className="action-card-title">Practice Exam</h3>
              <p className="action-card-desc">Test your knowledge</p>
            </Link>

            <Link to="/student-profile" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h3 className="action-card-title">My Profile</h3>
              <p className="action-card-desc">View and edit your profile</p>
            </Link>

            <Link to="/exam-records" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <path d="M9 15l2 2 4-4"/>
                </svg>
              </div>
              <h3 className="action-card-title">Exam Records</h3>
              <p className="action-card-desc">View your exam history</p>
            </Link>

            <Link to="/progress" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h3 className="action-card-title">My Progress</h3>
              <p className="action-card-desc">Track your performance</p>
            </Link>

            <Link to="/payments" className="action-card">
              <div className="action-card-icon-wrapper">
                <svg className="action-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
              </div>
              <h3 className="action-card-title">Payments</h3>
              <p className="action-card-desc">View fee status</p>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar-section">
          {/* Upcoming Classes */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Next Class</h3>
            {nextClass ? (
              <div className="notification-item">
                <p className="notification-title">{nextClass.topic || nextClass.batch?.name || 'Class'}</p>
                <p className="notification-text">
                  {new Date(nextClass.date).toLocaleDateString('en-US', { weekday: 'long' })}, {nextClass.startTime} - {nextClass.endTime}
                </p>
                <p className="notification-text">{nextClass.location || 'Studio'}</p>
                <span className="notification-time">
                  {new Date(nextClass.date).toDateString() === new Date().toDateString() ? 'Today' : new Date(nextClass.date).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="notification-item">
                <p className="notification-text">No upcoming classes scheduled.</p>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="sidebar-card">
            <h3 className="sidebar-title">Notifications</h3>
            {notifications.length === 0 ? (
              <div className="notification-item">
                <p className="notification-text">No new notifications</p>
              </div>
            ) : (
              notifications.slice(0, 3).map((notif) => (
                <div key={notif._id} className="notification-item">
                  <p className="notification-title">{notif.title}</p>
                  <p className="notification-text">{notif.message}</p>
                  <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Feedback & Notifications */}
      <div className="full-width-section">
        <div className="section-header">
          <h2 className="section-title">Recent Feedback</h2>
          <Link to="/progress" className="view-all-btn">View All</Link>
        </div>
        <div className="content-grid">
          {notifications.length === 0 ? (
            <div className="content-card">
              <p className="content-desc">No feedback yet.</p>
            </div>
          ) : (
            notifications
              .filter((notif) => notif.type === 'general' || notif.meta?.source === 'feedback')
              .slice(0, 2)
              .map((notif) => (
                <div key={notif._id} className="content-card">
                  <div className="content-card-header">
                    <span className="content-badge">{new Date(notif.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <h3 className="content-title">{notif.title || 'Feedback'}</h3>
                  <p className="content-desc">{notif.message}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
