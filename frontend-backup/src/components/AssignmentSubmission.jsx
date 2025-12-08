import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AssignmentSubmission({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // MOCK DATA - Replace with API call later
    // TODO: GET /api/assignments/:id
    setAssignment({
      id: 1,
      title: 'Submit Adavu Sequence',
      description: 'Record and submit a video demonstrating all 8 Adavu sequences. Ensure proper aramandi position, clear footwork, and synchronized hand movements.',
      dueDate: 'November 20, 2025',
      instructions: [
        'Video should be 3-5 minutes long',
        'Record in landscape mode with good lighting',
        'Wear traditional practice attire (preferably cotton saree or salwar)',
        'Demonstrate each Adavu clearly with proper count',
        'Ensure proper aramandi (half-sitting) posture throughout',
        'Show mudras (hand gestures) clearly in frame'
      ]
    });
  }, [id]);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // MOCK SUBMISSION - Replace with API call later
    // TODO: POST /api/submissions with FormData (video file + assignment id)
    
    setTimeout(() => {
      alert('Assignment submitted successfully! ✅\n\nYour teacher will review it soon.');
      navigate('/student');
    }, 1500);
  };

  if (!assignment) return <div style={{textAlign: 'center', padding: '3rem', color: 'white'}}>Loading...</div>;

  return (
    <div className="container">
      <div className="assignment-detail">
        <h1>{assignment.title}</h1>
        <p className="due-date">📅 Due: {assignment.dueDate}</p>

        <div className="assignment-description">
          <h2>Assignment Description</h2>
          <p>{assignment.description}</p>
        </div>

        <div className="assignment-instructions">
          <h2>Instructions</h2>
          <ul>
            {assignment.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="submission-form">
          <h2>Submit Your Video</h2>
          
          <div className="file-upload">
            <label htmlFor="video-upload" className="file-label">
              {videoFile ? `✅ ${videoFile.name}` : '📹 Choose Video File'}
            </label>
            <input 
              id="video-upload"
              type="file" 
              accept="video/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {videoFile && (
            <div className="file-preview">
              <p><strong>Selected File:</strong> {videoFile.name}</p>
              <p><strong>Size:</strong> {(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {videoFile.type}</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary btn-large"
            disabled={submitting}
          >
            {submitting ? 'Uploading... Please wait' : 'Submit Assignment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssignmentSubmission;