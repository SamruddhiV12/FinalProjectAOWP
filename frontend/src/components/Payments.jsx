import React, { useState, useEffect } from 'react';

function Payments({ user }) {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [pendingAmount, setPendingAmount] = useState(0);

  useEffect(() => {
    // MOCK DATA - Replace with API call later
    // TODO: GET /api/payments/student/:id
    setPaymentHistory([
      {
        id: 1,
        month: 'November 2025',
        amount: 3000,
        dueDate: '2025-11-05',
        paidDate: '2025-11-03',
        status: 'paid',
        method: 'UPI'
      },
      {
        id: 2,
        month: 'October 2025',
        amount: 3000,
        dueDate: '2025-10-05',
        paidDate: '2025-10-05',
        status: 'paid',
        method: 'Cash'
      },
      {
        id: 3,
        month: 'September 2025',
        amount: 3000,
        dueDate: '2025-09-05',
        paidDate: '2025-09-08',
        status: 'paid',
        method: 'Bank Transfer'
      },
      {
        id: 4,
        month: 'December 2025',
        amount: 3000,
        dueDate: '2025-12-05',
        paidDate: null,
        status: 'pending',
        method: null
      }
    ]);

    setPendingAmount(3000);
  }, [user.id]);

  const handlePayNow = () => {
    alert('Payment Gateway Integration\n\n(In production, this will redirect to payment gateway like Razorpay/Stripe)');
  };

  return (
    <div className="container">
      {/* Pending Payment Alert */}
      {pendingAmount > 0 && (
        <div className="notification-card" style={{background: 'linear-gradient(135deg, #ff4757 0%, #ff6348 100%)'}}>
          <h3>⚠️ Payment Due</h3>
          <p style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '1rem 0'}}>
            ₹{pendingAmount}
          </p>
          <p>For December 2025 | Due: 05-Dec-2025</p>
          <button 
            onClick={handlePayNow}
            className="btn-primary"
            style={{marginTop: '1rem', background: 'white', color: '#ff4757', border: '2px solid white'}}
          >
            Pay Now
          </button>
        </div>
      )}

      {/* Payment Summary */}
      <section className="section">
        <h1>💳 Payment Information</h1>
        
        <div className="stats-grid" style={{marginTop: '2rem'}}>
          <div className="stat-card">
            <h3>₹3,000</h3>
            <p>Monthly Fee</p>
          </div>
          <div className="stat-card highlight">
            <h3>₹{pendingAmount}</h3>
            <p>Pending Amount</p>
          </div>
          <div className="stat-card">
            <h3>₹9,000</h3>
            <p>Paid This Year</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
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
            {paymentHistory.map(payment => (
              <tr key={payment.id}>
                <td><strong>{payment.month}</strong></td>
                <td>₹{payment.amount}</td>
                <td>{payment.dueDate}</td>
                <td>{payment.paidDate || '-'}</td>
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
            ))}
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
          <h3 style={{color: '#8B0000', marginBottom: '1rem'}}>Intermediate Batch</h3>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{padding: '0.5rem 0', borderBottom: '1px solid #F4E4C1'}}>
              <strong>Monthly Tuition:</strong> ₹3,000
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