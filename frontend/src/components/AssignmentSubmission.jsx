import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AssignmentSubmission({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/assignments/${id}`,
        config
      );

      if (res.data.success) {
        setAssignment(res.data.data);

        // If there's an existing submission, pre-fill the form
        if (res.data.data.submission) {
          setSubmissionText(res.data.data.submission.submissionText || '');
          setSubmissionUrl(res.data.data.submission.submissionUrl || '');
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching assignment:', err);
      setError('Failed to load assignment details');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/assignments/${id}/submit`,
        {
          submissionText,
          submissionUrl
        },
        config
      );

      if (res.data.success) {
        alert('Assignment submitted successfully! ✅\n\nYour teacher will review it soon.');
        navigate('/student');
      }
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError(err.response?.data?.message || 'Failed to submit assignment');
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '3rem', color: 'white'}}>Loading assignment...</div>;
  if (error && !assignment) return <div style={{textAlign: 'center', padding: '3rem', color: 'red'}}>{error}</div>;
  if (!assignment) return <div style={{textAlign: 'center', padding: '3rem', color: 'white'}}>Assignment not found</div>;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = new Date(assignment.dueDate) < new Date();
  const submissionStatus = assignment.submission?.status || 'Not Submitted';

  return (
    <div className="container">
      <div className="assignment-detail">
        <h1>{assignment.title}</h1>
        <p className="due-date" style={{ color: isOverdue ? '#e74c3c' : '#2ecc71', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>Due: {formatDate(assignment.dueDate)} {isOverdue && '(Overdue)'}</span>
        </p>

        {submissionStatus !== 'Not Submitted' && (
          <div style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '8px',
            background: submissionStatus === 'Graded' ? '#d4edda' : '#fff3cd',
            border: `1px solid ${submissionStatus === 'Graded' ? '#c3e6cb' : '#ffeeba'}`
          }}>
            <strong>Status:</strong> {submissionStatus}
            {assignment.submission?.grade && (
              <span> | <strong>Grade:</strong> {assignment.submission.grade}/{assignment.maxPoints}</span>
            )}
            {assignment.submission?.feedback && (
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Feedback:</strong> {assignment.submission.feedback}
              </div>
            )}
          </div>
        )}

        <div className="assignment-description">
          <h2>Assignment Description</h2>
          <p>{assignment.description}</p>
        </div>

        {assignment.instructions && (
          <div className="assignment-instructions">
            <h2>Instructions</h2>
            <p style={{ whiteSpace: 'pre-wrap' }}>{assignment.instructions}</p>
          </div>
        )}

        {error && (
          <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            background: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="submission-form">
          <h2>{submissionStatus === 'Not Submitted' ? 'Submit Your Work' : 'Update Your Submission'}</h2>

          <div className="form-group">
            <label htmlFor="submission-url">
              Video/File URL (Google Drive, YouTube, etc.)
            </label>
            <input
              id="submission-url"
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://drive.google.com/... or https://youtube.com/..."
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label htmlFor="submission-text">
              Additional Notes (optional)
            </label>
            <textarea
              id="submission-text"
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Add any notes about your submission..."
              rows="5"
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-large"
            disabled={submitting}
            style={{ marginTop: '1.5rem' }}
          >
            {submitting ? 'Submitting... Please wait' : submissionStatus === 'Not Submitted' ? 'Submit Assignment' : 'Update Submission'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssignmentSubmission;