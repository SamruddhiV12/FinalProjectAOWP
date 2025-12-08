import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProgressReport({ user }) {
  const [progressData, setProgressData] = useState({
    attendance: 0,
    assignmentsCompleted: 0,
    examsGiven: 0,
    currentBatch: '—',
  });
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const statsPromise = axios.get(`${process.env.REACT_APP_API_URL}/api/student-profile/stats`, config);
        const feedbackPromise = axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, config);

        const [statsRes, feedbackRes] = await Promise.all([statsPromise, feedbackPromise]);

        if (statsRes.data.success) {
          setProgressData({
            attendance: statsRes.data.data?.attendance || 0,
            assignmentsCompleted: statsRes.data.data?.assignmentsCompleted || 0,
            examsGiven: statsRes.data.data?.examsGiven || 0,
            currentBatch: statsRes.data.data?.currentBatch || '—',
          });
        }

        if (feedbackRes.data.success) {
          const onlyFeedback = (feedbackRes.data.data || []).filter(
            (n) => n.type === 'general' || n.meta?.source === 'feedback'
          );
          setFeedback(onlyFeedback);
        }
      } catch (err) {
        console.error('Progress fetch error:', err);
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <div className="container">
      {error && (
        <div style={{background: '#fff3cd', color: '#856404', padding: '1rem 1.25rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #ffeeba'}}>
          {error} (showing available data)
        </div>
      )}
      <h1>My Progress Report</h1>
      <p className="subtitle">{user?.firstName} {user?.lastName}</p>

      {/* Overall Stats */}
      <section className="section">
        <h2>📊 Overall Performance</h2>
        <div className="stats-grid">
          <div className="stat-card highlight">
            <h3>{progressData.attendance}%</h3>
            <p>Attendance</p>
          </div>
          <div className="stat-card highlight">
            <h3>{progressData.assignmentsCompleted || 0}</h3>
            <p>Assignments Done</p>
          </div>
          <div className="stat-card highlight">
            <h3>{progressData.examsGiven || 0}</h3>
            <p>Exams Given</p>
          </div>
          <div className="stat-card highlight">
            <h3>{progressData.currentBatch || '—'}</h3>
            <p>Current Batch</p>
          </div>
        </div>
      </section>

      {/* Recent Feedback */}
      <section className="section">
        <h2>💬 Recent Feedback from Teacher</h2>
        <div className="feedback-timeline">
          {feedback.length === 0 ? (
            <div className="feedback-item">
              <p className="feedback-comment">No feedback yet.</p>
            </div>
          ) : (
            feedback.slice(0, 5).map((item) => (
              <div key={item._id} className="feedback-item">
                <div className="feedback-header">
                  <h3>{item.title || 'Feedback'}</h3>
                  {item.rating && <span className="rating">⭐ {item.rating}/5</span>}
                </div>
                <p className="feedback-meta">
                  📅 {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {item.sender || 'Teacher'}
                </p>
                <p className="feedback-comment">{item.message || item.description}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default ProgressReport;
