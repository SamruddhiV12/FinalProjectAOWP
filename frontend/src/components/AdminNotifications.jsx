import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminNotifications.css';

function AdminNotifications() {
  const [activeTab, setActiveTab] = useState('send'); // send, history
  const [notificationType, setNotificationType] = useState('payment_reminder');

  // Batch & student data
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Notification fields
  const [paymentMonth, setPaymentMonth] = useState(new Date().toISOString().slice(0, 7));
  const [paymentAmount, setPaymentAmount] = useState('');
  const [scheduleMessage, setScheduleMessage] = useState('');

  // Status
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // History
  const [history, setHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('all'); // all, schedule_published, schedule_updated, payment_reminder

  useEffect(() => {
    fetchBatches();
    fetchHistory();
  }, []);

  useEffect(() => {
    setStatusMessage('');
    setSelectedStudents([]);
  }, [notificationType, selectedBatch]);      

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchBatches = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/batches?isActive=true', {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setBatches(data.data);
        if (data.data.length > 0) setSelectedBatch(data.data[0]._id);
      }
    } catch (err) {
      console.error('Error loading batches', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/notifications/sent', {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) setHistory(data.data);
    } catch (err) {
      console.error('Error loading history', err);
    }
  };

  const getCurrentBatch = () => {
    return batches.find((b) => b._id === selectedBatch);
  };

  const getBatchStudents = () => {
    const batch = getCurrentBatch();
    return batch?.students || [];
  };

  const getFilteredStudents = () => {
    const batchStudents = getBatchStudents();
    if (!searchTerm) return batchStudents;

    const term = searchTerm.toLowerCase();
    return batchStudents.filter((s) => {
      const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
      const email = (s.email || '').toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  };

  const handleSelectAll = () => {
    setSelectedStudents(getBatchStudents().map((s) => s._id));
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
  };

  const toggleStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSendPaymentReminder = async () => {
    if (!selectedBatch) {
      setStatusMessage('⚠️ Please select a batch');
      return;
    }

    const batch = getCurrentBatch();
    const recipients = selectedStudents.length > 0
      ? selectedStudents
      : getBatchStudents().map((s) => s._id);

    if (recipients.length === 0) {
      setStatusMessage('⚠️ No students in this batch');
      return;
    }

    setSending(true);
    setStatusMessage('');

    try {
      const res = await fetch('http://localhost:5001/api/notifications/payment-reminder', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          batchId: selectedBatch,
          studentIds: recipients,
          monthLabel: paymentMonth,
          amount: paymentAmount || batch?.monthlyFee,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage(`✓ Payment reminder sent to ${data.data.length} student${data.data.length > 1 ? 's' : ''}`);
        setSelectedStudents([]);
        fetchHistory();
      } else {
        setStatusMessage(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('⚠️ Failed to send payment reminder');
    } finally {
      setSending(false);
    }
  };

  const handleSendScheduleNotification = async () => {
    if (!scheduleMessage.trim()) {
      setStatusMessage('⚠️ Please enter a message about the schedule change');
      return;
    }

    if (!selectedBatch) {
      setStatusMessage('⚠️ Please select a batch');
      return;
    }

    const recipients = selectedStudents.length > 0
      ? selectedStudents
      : getBatchStudents().map((s) => s._id);

    if (recipients.length === 0) {
      setStatusMessage('⚠️ No students in this batch');
      return;
    }

    setSending(true);
    setStatusMessage('');

    const batch = getCurrentBatch();
    const title = notificationType === 'schedule_published'
      ? '📅 New Class Schedule Published'
      : '⚠️ Schedule Updated';

    try {
      const res = await fetch('http://localhost:5001/api/notifications', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          userIds: recipients,
          type: notificationType,
          title,
          message: `${batch?.name || 'Your batch'}: ${scheduleMessage}`,
          meta: { batchId: selectedBatch },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage(`✓ Notification sent to ${data.data.length} student${data.data.length > 1 ? 's' : ''}`);
        setScheduleMessage('');
        setSelectedStudents([]);
        fetchHistory();
      } else {
        setStatusMessage(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('⚠️ Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  const getFilteredHistory = () => {
    if (historyFilter === 'all') return history;
    return history.filter((n) => n.type === historyFilter);
  };

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notif-header">
        <div>
          <h1>📢 Send Notifications</h1>
          <p className="notif-subtitle">
            Notify students about schedule changes and payment reminders
          </p>
        </div>
        <Link to="/admin" className="btn-back">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="notif-tabs">
        <button
          className={`tab-btn ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send Notification
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History ({history.length})
        </button>
      </div>

      {activeTab === 'send' && (
        <div className="notif-content">
          <div className="notif-grid">
            {/* Left: Notification Type & Content */}
            <div className="notif-section">
              <div className="notif-card">
                <h3>1. Select Notification Type</h3>
                <div className="type-cards">
                  <label className={`type-card ${notificationType === 'payment_reminder' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value="payment_reminder"
                      checked={notificationType === 'payment_reminder'}
                      onChange={(e) => setNotificationType(e.target.value)}
                    />
                    <div className="type-card-content">
                      <div className="type-icon">💰</div>
                      <div>
                        <div className="type-title">Payment Reminder</div>
                        <div className="type-desc">Remind students about pending fees</div>
                      </div>
                    </div>
                  </label>

                  <label className={`type-card ${notificationType === 'schedule_published' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value="schedule_published"
                      checked={notificationType === 'schedule_published'}
                      onChange={(e) => setNotificationType(e.target.value)}
                    />
                    <div className="type-card-content">
                      <div className="type-icon">📅</div>
                      <div>
                        <div className="type-title">New Schedule Published</div>
                        <div className="type-desc">Notify about new class schedule</div>
                      </div>
                    </div>
                  </label>

                  <label className={`type-card ${notificationType === 'schedule_updated' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="type"
                      value="schedule_updated"
                      checked={notificationType === 'schedule_updated'}
                      onChange={(e) => setNotificationType(e.target.value)}
                    />
                    <div className="type-card-content">
                      <div className="type-icon">⚠️</div>
                      <div>
                        <div className="type-title">Schedule Updated</div>
                        <div className="type-desc">Notify about changes to schedule</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Content based on type */}
              {notificationType === 'payment_reminder' && (
                <div className="notif-card">
                  <h3>2. Payment Details</h3>
                  <div className="form-group">
                    <label>Month</label>
                    <input
                      type="month"
                      value={paymentMonth}
                      onChange={(e) => setPaymentMonth(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Amount (Optional)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={`Defaults to batch fee: ₹${getCurrentBatch()?.monthlyFee || '0'}`}
                    />
                    <small className="form-hint">
                      Leave empty to use batch's monthly fee
                    </small>
                  </div>
                </div>
              )}

              {(notificationType === 'schedule_published' || notificationType === 'schedule_updated') && (
                <div className="notif-card">
                  <h3>2. Schedule Message</h3>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={scheduleMessage}
                      onChange={(e) => setScheduleMessage(e.target.value)}
                      rows={4}
                      placeholder="Example: New classes scheduled for next week Monday to Friday, 5 PM to 6 PM"
                    />
                    <small className="form-hint">
                      Describe the schedule change or new schedule details
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Recipients */}
            <div className="notif-section">
              <div className="notif-card">
                <h3>3. Select Recipients</h3>

                <div className="form-group">
                  <label>Batch</label>
                  <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name} ({b.level}) - {b.students?.length || 0} students
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Search Students (Optional)</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                  />
                </div>

                <div className="selection-actions">
                  <button type="button" className="btn-chip" onClick={handleSelectAll}>
                    Select All ({getBatchStudents().length})
                  </button>
                  <button type="button" className="btn-chip secondary" onClick={handleClearSelection}>
                    Clear
                  </button>
                </div>

                <div className="recipients-info">
                  {selectedStudents.length > 0 ? (
                    <span className="selected-count">
                      {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                    </span>
                  ) : (
                    <span className="all-batch-info">
                      All {getBatchStudents().length} students in batch will be notified
                    </span>
                  )}
                </div>

                <div className="students-list">
                  {getFilteredStudents().map((student) => (
                    <label key={student._id} className="student-item">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => toggleStudent(student._id)}
                      />
                      <div className="student-info">
                        <div className="student-name">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </label>
                  ))}
                  {getFilteredStudents().length === 0 && (
                    <div className="no-students">No students found</div>
                  )}
                </div>
              </div>

              <div className="notif-card send-card">
                {statusMessage && (
                  <div className={`status-message ${statusMessage.startsWith('✓') ? 'success' : 'error'}`}>
                    {statusMessage}
                  </div>
                )}

                {notificationType === 'payment_reminder' ? (
                  <button
                    className="btn-send"
                    onClick={handleSendPaymentReminder}
                    disabled={sending}
                  >
                    {sending ? 'Sending...' : `Send Payment Reminder`}
                  </button>
                ) : (
                  <button
                    className="btn-send"
                    onClick={handleSendScheduleNotification}
                    disabled={sending}
                  >
                    {sending ? 'Sending...' : `Send ${notificationType === 'schedule_published' ? 'Schedule' : 'Update'} Notification`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="notif-content">
          <div className="history-section">
            <div className="history-header">
              <h2>Notification History</h2>
              <div className="history-filters">
                <button
                  className={`filter-btn ${historyFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setHistoryFilter('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${historyFilter === 'payment_reminder' ? 'active' : ''}`}
                  onClick={() => setHistoryFilter('payment_reminder')}
                >
                  Payment
                </button>
                <button
                  className={`filter-btn ${historyFilter === 'schedule_published' ? 'active' : ''}`}
                  onClick={() => setHistoryFilter('schedule_published')}
                >
                  New Schedule
                </button>
                <button
                  className={`filter-btn ${historyFilter === 'schedule_updated' ? 'active' : ''}`}
                  onClick={() => setHistoryFilter('schedule_updated')}
                >
                  Schedule Update
                </button>
              </div>
            </div>

            <div className="history-list">
              {getFilteredHistory().length === 0 ? (
                <div className="no-history">
                  <div className="no-history-icon">📭</div>
                  <div className="no-history-text">No notifications sent yet</div>
                </div>
              ) : (
                getFilteredHistory().map((notif) => (
                  <div key={notif._id} className="history-item">
                    <div className="history-item-header">
                      <span className={`history-badge ${notif.type}`}>
                        {notif.type === 'payment_reminder' && '💰 Payment'}
                        {notif.type === 'schedule_published' && '📅 Schedule'}
                        {notif.type === 'schedule_updated' && '⚠️ Update'}
                      </span>
                      <span className="history-date">
                        {new Date(notif.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="history-item-content">
                      <div className="history-title">{notif.title}</div>
                      <div className="history-message">{notif.message}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminNotifications;
