import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Payments({ user }) {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [monthlyFee, setMonthlyFee] = useState(0);
  const [paidThisYear, setPaidThisYear] = useState(0);
  const [paymentRecord, setPaymentRecord] = useState('0%');
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/payments`, config);

        if (res.data.success) {
          const payments = res.data.data || [];
          setPaymentHistory(payments);

          const firstAmount = payments[0]?.amount || 0;
          setMonthlyFee(firstAmount);

          const pending = payments.filter(p => p.status === 'pending');
          const pendingTotal = pending.reduce((sum, p) => sum + (p.amount || 0), 0);
          setPendingAmount(pendingTotal);

          const currentYear = new Date().getFullYear();
          const paidTotal = payments
            .filter(p => p.status === 'paid' && new Date(p.month).getFullYear() === currentYear)
            .reduce((sum, p) => sum + (p.amount || 0), 0);
          setPaidThisYear(paidTotal);

          const paidCount = payments.filter(p => p.status === 'paid').length;
          const record = payments.length > 0 ? Math.round((paidCount / payments.length) * 100) : 0;
          setPaymentRecord(`${record}%`);

          if (payments.length === 0) {
            setBanner('No payment records yet.');
          }
        } else {
          setBanner('No payment records yet.');
        }
      } catch (err) {
        console.error('Payments fetch error:', err);
        setError('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user?.id]);

  const handlePayNow = () => {
    alert('Payment Gateway Integration\n\n(In production, this will redirect to payment gateway like Razorpay/Stripe)');
  };

  const formatMonth = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="container">
      {error && (
        <div className="notification-card" style={{background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', marginBottom: '1.5rem'}}>
          {error} (showing available data)
        </div>
      )}
      {banner && !error && (
        <div className="notification-card" style={{background: '#e8f4fd', color: '#0c5460', border: '1px solid #b8e2f2', marginBottom: '1.5rem'}}>
          {banner}
        </div>
      )}

      {/* Pending Payment Alert */}
      {pendingAmount > 0 ? (
        <div className="notification-card" style={{background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)'}}>
          <h3>⚠️ Payment Due</h3>
          <p style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0'}}>
            ₹{pendingAmount}
          </p>
          <p>Pending invoices listed below</p>
          <button 
            onClick={handlePayNow}
            className="btn-primary"
            style={{marginTop: '1rem', background: 'white', color: '#ff4757', border: '2px solid white'}}
          >
            Pay Now
          </button>
        </div>
      ) : (
        <div className="notification-card" style={{background: 'linear-gradient(135deg, #e8f4fd 0%, #d2e8f9 100%)'}}>
          <h3>✅ No Pending Payments</h3>
          <p>All caught up! Check your history below.</p>
        </div>
      )}

      {/* Payment Summary */}
      <section className="section">
        <h1>💳 Payment Information</h1>
        
        <div className="stats-grid" style={{marginTop: '2rem'}}>
          <div className="stat-card">
            <h3>₹{monthlyFee}</h3>
            <p>Monthly Fee</p>
          </div>
          <div className="stat-card highlight">
            <h3>₹{pendingAmount}</h3>
            <p>Pending Amount</p>
          </div>
          <div className="stat-card">
            <h3>₹{paidThisYear}</h3>
            <p>Paid This Year</p>
          </div>
          <div className="stat-card">
            <h3>{paymentRecord}</h3>
            <p>Payment Record</p>
          </div>
        </div>
      </section>

      {/* Payment History */}
      <section className="section">
        <h2>📊 Payment History</h2>
        
        <table className="data-table" style={{marginTop: '1.5rem'}}>
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Paid Date</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.length === 0 ? (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', padding: '1rem'}}>No payments found.</td>
              </tr>
            ) : (
              paymentHistory.map(payment => (
                <tr key={payment._id || payment.id}>
                  <td><strong>{formatMonth(payment.month)}</strong></td>
                  <td>₹{payment.amount}</td>
                  <td>-</td>
                  <td>{payment.paidOn ? formatDate(payment.paidOn) : '-'}</td>
                  <td>{payment.method || '-'}</td>
                  <td>
                    <span 
                      className="status"
                      style={{
                        background: payment.status === 'paid' 
                          ? 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)'
                          : 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
                        color: payment.status === 'paid' ? '#155724' : '#856404',
                        border: payment.status === 'paid' ? '2px solid #28a745' : '2px solid #ffc107'
                      }}
                    >
                      {payment.status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Fee Structure */}
      <section className="section">
        <h2>📋 Fee Structure</h2>
        <div style={{
          background: 'linear-gradient(135deg, #FFF8E7 0%, #F4E4C1 100%)',
          padding: '2rem',
          borderRadius: '15px',
          border: '2px solid #FFD700',
          marginTop: '1.5rem'
        }}>
          <h3 style={{color: '#8B0000', marginBottom: '1rem'}}>Fee Structure</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{padding: '0.5rem 0', borderBottom: '1px solid #F4E4C1'}}>
              <strong>Monthly Tuition:</strong> ₹{monthlyFee || '—'}
            </li>
            <li style={{padding: '0.5rem 0', borderBottom: '1px solid #F4E4C1'}}>
              <strong>Examination Fee:</strong> ₹1,500 (once a year)
            </li>
            <li style={{padding: '0.5rem 0', borderBottom: '1px solid #F4E4C1'}}>
              <strong>Costume (Annual Performance):</strong> ₹5,000 (optional)
            </li>
            <li style={{padding: '0.5rem 0'}}>
              <strong>Study Materials:</strong> Included
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Payments;
