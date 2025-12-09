import React, { useState, useEffect } from 'react';

function ReviewSubmissions({ user }) {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState({
    footwork: 0,
    rhythm: 0,
    expression: 0,
    comments: ''
  });

  useEffect(() => {
    setSubmissions([
      { 
        id: 1, 
        studentName: 'Priya Sharma', 
        assignmentTitle: 'Adavu Sequence',
        submittedDate: '2025-11-10',
        videoUrl: 'https://example.com/video1.mp4'
      },
      { 
        id: 2, 
        studentName: 'Ananya Reddy', 
        assignmentTitle: 'Alarippu Performance',
        submittedDate: '2025-11-09',
        videoUrl: 'https://example.com/video2.mp4'
      },
      { 
        id: 3, 
        studentName: 'Kavya Iyer', 
        assignmentTitle: 'Adavu Sequence',
        submittedDate: '2025-11-08',
        videoUrl: 'https://example.com/video3.mp4'
      }
    ]);
  }, []);

  const handleReview = (submission) => {
    setSelectedSubmission(submission);
    setFeedback({ footwork: 0, rhythm: 0, expression: 0, comments: '' });
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();

    if (feedback.footwork === 0 || feedback.rhythm === 0 || feedback.expression === 0) {
      alert('Please rate all skill areas before submitting.');
      return;
    }

    alert('Feedback submitted successfully! ✅\n\nThe student will be notified.');
    setSelectedSubmission(null);
    setSubmissions(submissions.filter(s => s.id !== selectedSubmission.id));
  };

  return (
    <div className="container">
      <h1>Review Submissions</h1>

      {!selectedSubmission ? (
        <div className="submissions-list">
          <h2>Pending Reviews ({submissions.length})</h2>
          {submissions.length === 0 ? (
            <p style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
              🎉 All caught up! No pending submissions to review.
            </p>
          ) : (
            submissions.map(submission => (
              <div key={submission.id} className="submission-card">
                <div>
                  <h3>{submission.studentName}</h3>
                  <p><strong>{submission.assignmentTitle}</strong></p>
                  <p className="submitted-date">Submitted: {submission.submittedDate}</p>
                </div>
                <button 
                  onClick={() => handleReview(submission)}
                  className="btn-primary"
                >
                  Review Submission
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="review-container">
          <button 
            onClick={() => setSelectedSubmission(null)}
            className="btn-back"
          >
            ← Back to List
          </button>

          <h2>Reviewing: {selectedSubmission.studentName}</h2>
          <h3>{selectedSubmission.assignmentTitle}</h3>

          {/* Video Player */}
          <div className="video-player">
            <div className="video-placeholder">
              <p>📹 Video Player</p>
              <p style={{fontSize: '1rem', marginTop: '1rem'}}>Video URL: {selectedSubmission.videoUrl}</p>
              <p style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
                (In production, this will be an actual video player with controls)
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <form onSubmit={handleSubmitFeedback} className="feedback-form">
            <h3>Provide Detailed Feedback</h3>

            <div className="rating-group">
              <label>Footwork (Adavu Precision & Aramandi):</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star}
                    className={feedback.footwork >= star ? 'star filled' : 'star'}
                    onClick={() => setFeedback({...feedback, footwork: star})}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="rating-group">
              <label>Rhythm (Tala Accuracy & Timing):</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star}
                    className={feedback.rhythm >= star ? 'star filled' : 'star'}
                    onClick={() => setFeedback({...feedback, rhythm: star})}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="rating-group">
              <label>Expression (Abhinaya & Mudras):</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star}
                    className={feedback.expression >= star ? 'star filled' : 'star'}
                    onClick={() => setFeedback({...feedback, expression: star})}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Detailed Comments:</label>
              <textarea 
                value={feedback.comments}
                onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                placeholder="Provide specific feedback on the performance:
- Strengths observed
- Areas for improvement
- Specific suggestions (e.g., 'At 1:30, work on maintaining aramandi deeper')
- Encouragement and next steps"
                rows="8"
                required
              />
            </div>

            <button type="submit" className="btn-primary btn-large">
              Submit Feedback to Student
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ReviewSubmissions;