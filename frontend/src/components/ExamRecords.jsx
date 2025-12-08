import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ExamRecords.css';

function ExamRecords() {
  const [exams, setExams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    fetchExams();
    fetchStats();
  }, []);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchExams = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/exams`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setExams(data.data);
      }
    } catch (err) {
      console.error('Error fetching exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/exams/stats`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching exam stats:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGradeColor = (grade) => {
    if (['A+', 'A'].includes(grade)) return 'grade-excellent';
    if (['B+', 'B'].includes(grade)) return 'grade-good';
    if (['C+', 'C'].includes(grade)) return 'grade-average';
    return 'grade-poor';
  };

  const examTypes = ['All', 'Theory', 'Practical', 'Combined', 'Arangetram', 'Performance', 'Mid-term', 'Final'];

  const filteredExams = filterType === 'All'
    ? exams
    : exams.filter(exam => exam.examType === filterType);

  if (loading) {
    return (
      <div className="exam-records-page">
        <div className="loading-state">Loading exam records...</div>
      </div>
    );
  }

  return (
    <div className="exam-records-page">
      {/* Header */}
      <div className="exam-header">
        <div className="header-content">
          <h1>Exam Records</h1>
          <p className="subtitle">View your complete exam history and performance</p>
        </div>
        <Link to="/student" className="btn-back">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Stats Section */}
      {stats && stats.totalExams > 0 && (
        <div className="exam-stats-section">
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalExams}</div>
                <div className="stat-label">Total Exams</div>
              </div>
            </div>

            <div className="stat-card stat-success">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{stats.averagePercentage}%</div>
                <div className="stat-label">Average Score</div>
              </div>
            </div>

            <div className="stat-card stat-excellent">
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <div className="stat-value">{stats.highestScore}%</div>
                <div className="stat-label">Highest Score</div>
              </div>
            </div>

            <div className="stat-card stat-info">
              <div className="stat-icon">📉</div>
              <div className="stat-content">
                <div className="stat-value">{stats.lowestScore}%</div>
                <div className="stat-label">Lowest Score</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="exam-filters">
        <div className="filter-buttons">
          {examTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Exam Records List */}
      <div className="exam-records-content">
        {filteredExams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Exam Records Found</h3>
            <p>
              {filterType === 'All'
                ? 'You haven\'t taken any exams yet.'
                : `No ${filterType} exams found.`}
            </p>
          </div>
        ) : (
          <div className="exam-list">
            {filteredExams.map(exam => (
              <div key={exam._id} className="exam-card">
                <div className="exam-card-header">
                  <div className="exam-title-section">
                    <h3 className="exam-name">{exam.examName}</h3>
                    <div className="exam-meta">
                      <span className="exam-type-badge">{exam.examType}</span>
                      <span className="exam-level-badge">{exam.examLevel}</span>
                      <span className="exam-date">{formatDate(exam.examDate)}</span>
                    </div>
                  </div>
                  <div className={`exam-grade ${getGradeColor(exam.grade)}`}>
                    {exam.grade}
                  </div>
                </div>

                <div className="exam-card-body">
                  <div className="exam-scores">
                    <div className="score-item">
                      <label>Marks Obtained</label>
                      <div className="score-value">
                        {exam.marksObtained} / {exam.totalMarks}
                      </div>
                    </div>

                    <div className="score-item">
                      <label>Percentage</label>
                      <div className="score-value percentage">
                        {exam.percentage}%
                      </div>
                    </div>

                    {exam.examiner && (
                      <div className="score-item">
                        <label>Examiner</label>
                        <div className="score-value">
                          {exam.examiner.name}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Component Breakdown */}
                  {exam.components && exam.components.length > 0 && (
                    <div className="exam-components">
                      <h4>Score Breakdown</h4>
                      <div className="components-grid">
                        {exam.components.map((component, index) => (
                          <div key={index} className="component-item">
                            <span className="component-name">{component.name}</span>
                            <span className="component-score">
                              {component.marksObtained}/{component.maxMarks}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  {exam.remarks && (
                    <div className="exam-remarks">
                      <h4>Remarks</h4>
                      <p>{exam.remarks}</p>
                    </div>
                  )}

                  {/* Strengths and Areas of Improvement */}
                  <div className="exam-feedback">
                    {exam.strengths && (
                      <div className="feedback-section strengths">
                        <h4>✓ Strengths</h4>
                        <p>{exam.strengths}</p>
                      </div>
                    )}

                    {exam.areasOfImprovement && (
                      <div className="feedback-section improvements">
                        <h4>💡 Areas of Improvement</h4>
                        <p>{exam.areasOfImprovement}</p>
                      </div>
                    )}
                  </div>

                  {/* Marksheet/Certificate */}
                  <div className="exam-actions">
                    {exam.marksheetUrl && (
                      <a
                        href={exam.marksheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-marksheet"
                      >
                        📄 View Marksheet
                      </a>
                    )}

                    {exam.certificateUrl && (
                      <a
                        href={exam.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-certificate"
                      >
                        🏆 View Certificate
                      </a>
                    )}

                    <button
                      onClick={() => setSelectedExam(selectedExam === exam._id ? null : exam._id)}
                      className="btn-details"
                    >
                      {selectedExam === exam._id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamRecords;
