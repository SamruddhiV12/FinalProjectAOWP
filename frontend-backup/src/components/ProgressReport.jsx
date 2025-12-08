import React, { useState, useEffect } from 'react';

function ProgressReport({ user }) {
  const [progressData, setProgressData] = useState(null);

  useEffect(() => {
    // MOCK DATA - Replace with API call later
    // TODO: GET /api/progress/student/:id
    setProgressData({
      attendance: 85,
      assignmentsCompleted: 12,
      averageScore: 4.2,
      skillRatings: {
        footwork: 4,
        rhythm: 5,
        expression: 3,
        mudras: 4,
        stamina: 4
      },
      recentFeedback: [
        {
          date: '2025-11-08',
          assignment: 'Alarippu Performance',
          teacher: 'Samruddhi',
          comment: 'Excellent rhythm and footwork! Your tala accuracy has improved significantly. Work on facial expressions during jathis to convey more emotion. Overall, a very strong performance.',
          rating: 4.5
        },
        {
          date: '2025-11-01',
          assignment: 'Adavu Sequence',
          teacher: 'Samruddhi',
          comment: 'Good aramandi position throughout. Practice transitions between adavus for smoother flow. Your hand movements (mudras) are precise. Keep practicing the 5th and 6th adavus.',
          rating: 4.0
        },
        {
          date: '2025-10-25',
          assignment: 'Theory Quiz - Natyashastra',
          teacher: 'Samruddhi',
          comment: 'Strong understanding of Natyashastra concepts, especially the explanation of Nava Rasas. Your written responses show deep knowledge. Excellent work!',
          rating: 5.0
        },
        {
          date: '2025-10-18',
          assignment: 'Jatiswaram Practice',
          teacher: 'Samruddhi',
          comment: 'Beautiful presentation! Your understanding of rhythmic patterns is evident. Focus on maintaining energy throughout the piece. The ending was particularly strong.',
          rating: 4.2
        }
      ]
    });
  }, [user.id]);

  if (!progressData) return <div style={{textAlign: 'center', padding: '3rem', color: 'white'}}>Loading...</div>;

  return (
    <div className="container">
      <h1>My Progress Report</h1>
      <p className="subtitle">{user.name} - {user.batch} Batch</p>

      {/* Overall Stats */}
      <section className="section">
        <h2>📊 Overall Performance</h2>
        <div className="stats-grid">
          <div className="stat-card highlight">
            <h3>{progressData.attendance}%</h3>
            <p>Attendance</p>
          </div>
          <div className="stat-card highlight">
            <h3>{progressData.assignmentsCompleted}</h3>
            <p>Assignments Done</p>
          </div>
          <div className="stat-card highlight">
            <h3>{progressData.averageScore}/5</h3>
            <p>Average Score</p>
          </div>
          <div className="stat-card highlight">
            <h3>3rd</h3>
            <p>Year of Training</p>
          </div>
        </div>
      </section>

      {/* Skill Breakdown */}
      <section className="section">
        <h2>🎯 Skill Assessment</h2>
        <div className="skills-chart">
          {Object.entries(progressData.skillRatings).map(([skill, rating]) => (
            <div key={skill} className="skill-bar">
              <div className="skill-label">
                <span style={{textTransform: 'capitalize', fontWeight: 'bold'}}>{skill}</span>
                <span style={{fontWeight: 'bold', color: '#8B0000'}}>{rating}/5</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(rating / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Progress Chart */}
      <section className="section">
        <h2>📈 Progress Over Time</h2>
        <div className="chart-placeholder">
          <p style={{fontSize: '1.3rem', color: '#8B0000', fontWeight: 'bold'}}>
            Performance Trend (Last 4 Months)
          </p>
          <p style={{fontSize: '0.95rem', color: '#666', marginTop: '0.5rem'}}>
            (In production, this will display an interactive Chart.js line graph)
          </p>
          <div className="mock-chart">
            <div className="chart-line" style={{height: '60%'}}></div>
            <div className="chart-line" style={{height: '70%'}}></div>
            <div className="chart-line" style={{height: '75%'}}></div>
            <div className="chart-line" style={{height: '85%'}}></div>
          </div>
          <p style={{fontSize: '0.9rem', color: '#666', marginTop: '1.5rem'}}>
            Aug &nbsp;&nbsp;&nbsp; Sep &nbsp;&nbsp;&nbsp; Oct &nbsp;&nbsp;&nbsp; Nov
          </p>
        </div>
      </section>

      {/* Recent Feedback */}
      <section className="section">
        <h2>💬 Recent Feedback from Teacher</h2>
        <div className="feedback-timeline">
          {progressData.recentFeedback.map((item, index) => (
            <div key={index} className="feedback-item">
              <div className="feedback-header">
                <h3>{item.assignment}</h3>
                <span className="rating">⭐ {item.rating}/5</span>
              </div>
              <p className="feedback-meta">
                📅 {item.date} • Teacher: {item.teacher}
              </p>
              <p className="feedback-comment">{item.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProgressReport;