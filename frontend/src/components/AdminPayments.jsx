import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminPayments.css';

function AdminPayments() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [students, setStudents] = useState([]);
  const [batchInfo, setBatchInfo] = useState(null);
  const [editingFee, setEditingFee] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      fetchBatchMonthView(selectedBatchId, selectedMonth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatchId, selectedMonth]);

  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/batches?isActive=true`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load batches');
      }
      setBatches(data.data);
      if (!selectedBatchId && data.data.length > 0) {
        setSelectedBatchId(data.data[0]._id);
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchMonthView = async (batchId, month) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/payments/batch-view?batchId=${batchId}&month=${month}`,
        { headers: authHeaders() }
      );
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to load payments');
      }
      setBatchInfo(data.data.batch);
      setStudents(data.data.students);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load payments');
      setStudents([]);
      setBatchInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const upsertPayment = async ({ studentId, amount, status }) => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payments`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          studentId,
          batchId: selectedBatchId,
          month: selectedMonth,
          amount,
          status,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to save payment');
      }
      return data.data;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save payment');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateStudentLocal = (studentId, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
  };

  const markStatus = async (studentId, nextStatus) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    const saved = await upsertPayment({
      studentId,
      amount: student.amount,
      status: nextStatus,
    });
    if (saved) {
      updateStudentLocal(studentId, {
        status: saved.status,
        amount: saved.amount,
        paymentId: saved._id,
        paidOn: saved.paidOn,
        updatedAt: saved.updatedAt,
      });
    }
  };

  const updateAmount = async (studentId, amount) => {
    const numericAmount = Number(amount) || 0;
    updateStudentLocal(studentId, { amount: numericAmount });
    await upsertPayment({ studentId, amount: numericAmount, status: 'pending' });
  };

  const markAllPaid = async () => {
    if (!window.confirm('Mark all students as paid for this month?')) return;
    setSaving(true);
    await Promise.all(
      students.map((s) =>
        upsertPayment({ studentId: s.id, amount: s.amount, status: 'paid' })
      )
    );
    fetchBatchMonthView(selectedBatchId, selectedMonth);
  };

  const handleSaveFee = async () => {
    if (!editingFee || !batchInfo) return;
    const value = Number(editingFee);
    if (Number.isNaN(value) || value <= 0) {
      alert('Enter a valid amount');
      return;
    }
    try {
      setSaving(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/batches/${batchInfo.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ monthlyFee: value }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to update fee');
      }
      setBatchInfo((prev) => ({ ...(prev || {}), monthlyFee: value }));
      setStudents((prev) => prev.map((s) => ({ ...s, amount: s.amount || value })));
      setEditingFee('');
      // refresh batches so the dropdown reflects updated fee
      fetchBatches();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update fee');
    } finally {
      setSaving(false);
    }
  };

  const formatMonthLabel = (monthStr) => {
    if (!monthStr) return '';
    const [year, month] = monthStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, 1));
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  };

  const stats = useMemo(() => {
    if (!students.length) {
      return { paid: 0, pending: 0, total: 0, paidAmount: 0, pendingAmount: 0 };
    }
    let paid = 0;
    let pending = 0;
    let paidAmount = 0;
    let pendingAmount = 0;

    students.forEach((student) => {
      if (student.status === 'paid') {
        paid += 1;
        paidAmount += student.amount || 0;
      } else {
        pending += 1;
        pendingAmount += student.amount || 0;
      }
    });

    return { paid, pending, total: students.length, paidAmount, pendingAmount };
  }, [students]);

  const filteredStudents = useMemo(() => {
    if (filterStatus === 'paid') return students.filter((s) => s.status === 'paid');
    if (filterStatus === 'pending') return students.filter((s) => s.status !== 'paid');
    return students;
  }, [students, filterStatus]);

  const renderLoading = () => (
    <div className="payments-admin-container">
      <div className="loading">Loading payments...</div>
    </div>
  );

  if (loading && !batchInfo) return renderLoading();

  if (error && !batchInfo) {
    return (
      <div className="payments-admin-container">
        <h1>Payments</h1>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="payments-admin-container">
      <div className="payments-header">
        <div>
          <p className="eyebrow">Admin · Payments</p>
          <h1>Batch Payments</h1>
          <p className="subtitle">Pick a batch → pick a month → mark paid / edit amounts. Everything saves instantly.</p>
        </div>
        <Link to="/admin" className="btn-back">
          ← Back
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="quick-flow">
        <div className="flow-chip filled">1. Choose batch</div>
        <div className="flow-chip">2. Choose month</div>
        <div className="flow-chip">3. Toggle paid / edit amount</div>
      </div>

      <div className="panel-row">
        <div className="panel primary-panel">
          <label>Batch</label>
          <p className="helper-text tight">Only active batches are listed.</p>
          <select value={selectedBatchId} onChange={(e) => setSelectedBatchId(e.target.value)}>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.name} ({batch.level})
              </option>
            ))}
          </select>
          <p className="helper-text strong">
            {batchInfo?.studentCount || 0} students · ₹{batchInfo?.monthlyFee || 0} / month
          </p>
        </div>

        <div className="panel">
          <label>Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <p className="helper-text tight">Viewing: {formatMonthLabel(selectedMonth)}</p>
        </div>

        <div className="panel">
          <label>Batch Monthly Fee</label>
          <div className="fee-editor">
            <input
              type="number"
              placeholder={batchInfo?.monthlyFee}
              value={editingFee}
              onChange={(e) => setEditingFee(e.target.value)}
            />
            <button type="button" className="btn-chip" onClick={handleSaveFee} disabled={saving}>
              Update
            </button>
          </div>
          <p className="helper-text">Defaults for all students in this batch.</p>
        </div>

        <div className="panel compact">
          <label>Filter</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <button
            type="button"
            className="btn-chip outline"
            onClick={markAllPaid}
            disabled={saving || !students.length}
          >
            Mark all paid
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Paid</p>
          <h3>
            {stats.paid} / {stats.total}
          </h3>
          <span className="pill success">₹{stats.paidAmount}</span>
        </div>
        <div className="stat-card">
          <p>Pending</p>
          <h3>
            {stats.pending} / {stats.total}
          </h3>
          <span className="pill warning">₹{stats.pendingAmount}</span>
        </div>
        <div className="stat-card">
          <p>Batch Amount</p>
          <h3>₹{batchInfo?.monthlyFee || 0}</h3>
          <span className="pill neutral">per month</span>
        </div>
        <div className="stat-card accent-card">
          <p>Selected Month</p>
          <h3>{formatMonthLabel(selectedMonth)}</h3>
          <span className="pill neutral">Active view</span>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Batch Students</h2>
            <p className="helper-text">
              Toggle paid/pending and edit amount for the chosen month.
            </p>
          </div>
          <div className="legend">
            <span className="pill success">Paid</span>
            <span className="pill warning">Pending</span>
            {saving && <span className="helper-text">Saving…</span>}
          </div>
        </div>

        {!students.length ? (
          <p className="helper-text">No students in this batch.</p>
        ) : (
          <div className="table">
            <div className="table-row head">
              <div>Student</div>
              <div>Amount</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {filteredStudents.map((student) => {
              const isPaid = student.status === 'paid';
              return (
                <div key={student.id} className="table-row">
                  <div>
                    <p className="strong">{student.name}</p>
                    <p className="small">{student.email}</p>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={student.amount}
                      onChange={(e) => updateAmount(student.id, e.target.value)}
                      className="amount-input"
                    />
                  </div>
                  <div>
                    <span className={`pill ${isPaid ? 'success' : 'warning'}`}>
                      {isPaid ? 'Paid' : 'Pending'}
                    </span>
                    {student.updatedAt && (
                      <p className="small muted">
                        {formatMonthLabel(selectedMonth)}
                      </p>
                    )}
                  </div>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className={`btn-chip ${isPaid ? 'outline' : ''}`}
                      onClick={() => markStatus(student.id, isPaid ? 'pending' : 'paid')}
                      disabled={saving}
                    >
                      {isPaid ? 'Mark pending' : 'Mark paid'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="glance-grid">
        {batches.map((batch) => (
          <div key={batch._id} className="glance-card">
            <div className="glance-top">
              <div>
                <p className="helper-text">{batch.level}</p>
                <h3>{batch.name}</h3>
              </div>
              <span className="pill neutral">₹{batch.monthlyFee || 0}</span>
            </div>
            <p className="small">
              {batch.students?.length || 0} students
            </p>
            {batch._id !== selectedBatchId && (
              <button
                type="button"
                className="btn-chip outline"
                onClick={() => setSelectedBatchId(batch._id)}
              >
                Manage
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPayments;
