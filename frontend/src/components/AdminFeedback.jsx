import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function AdminFeedback() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/students`, config());
      setStudents(res.data?.data || []);
      if (res.data?.data?.length) setSelectedStudent(res.data.data[0]._id);
    } catch (err) {
      console.error('Load students error', err);
      setStatus('Failed to load students');
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/batches?isActive=true`, config());
      setBatches(res.data?.data || []);
    } catch (err) {
      console.error('Load batches error', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/sent`, config());
      if (res.data?.success) setHistory(res.data.data || []);
    } catch (err) {
      console.error('Load feedback history error', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchStudents(), fetchBatches(), fetchHistory()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Reset selection when batch changes
    const list = getFilteredStudents();
    if (list.length) setSelectedStudent(list[0]._id);
  }, [selectedBatch]);

  const getFilteredStudents = () => {
    if (selectedBatch === 'all') return students;
    const batch = batches.find((b) => b._id === selectedBatch);
    return batch?.students || [];
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !title || !message) {
      setStatus('Please select a student and fill title/message.');
      return;
    }
    setSending(true);
    setStatus('');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/notifications`,
        {
          userIds: [selectedStudent],
          type: 'general',
          title,
          message,
          meta: { source: 'feedback', batchId: selectedBatch !== 'all' ? selectedBatch : undefined },
        },
        config()
      );
      setTitle('');
      setMessage('');
      setStatus('Feedback sent successfully.');
      fetchHistory();
    } catch (err) {
      console.error('Send feedback error', err);
      setStatus('Failed to send feedback');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-bar">
        <div className="header-left">
          <h1 className="dashboard-title">Student Feedback</h1>
          <p className="header-date">Send feedback to individual students</p>
        </div>
      </div>

      {status && (
        <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', background: '#e8f4fd', color: '#0c5460', borderRadius: '10px' }}>
          {status}
        </div>
      )}

      <div className="full-width-section">
        <h2 className="section-title">✉️ Send Feedback</h2>
        <form onSubmit={handleSend} className="actions-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Batch</label>
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
              <option value="all">All Students</option>
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b.name} ({b.level})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Student</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={loading || getFilteredStudents().length === 0}>
              {getFilteredStudents().map((s) => (
                <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.email})</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? 'Sending...' : 'Send Feedback'}
            </button>
          </div>
        </form>
      </div>

      <div className="full-width-section">
        <h2 className="section-title">📜 Recent Feedback Sent</h2>
        <div className="content-grid">
          {history.length === 0 ? (
            <div style={{ padding: '1rem', color: '#6B6B6B' }}>No feedback sent yet.</div>
          ) : (
            history
              .filter((n) => n.type === 'general')
              .slice(0, 6)
              .map((n) => (
                <div key={n._id} className="content-card">
                  <div className="content-card-header">
                    <span className="content-badge">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="content-title">{n.title}</h3>
                  <p className="content-desc">{n.message}</p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminFeedback;
