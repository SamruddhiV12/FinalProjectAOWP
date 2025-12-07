import React, { useState } from 'react';
import { authAPI } from '../services/api';
import fullLogo from '../assets/images/full-logo-sda.jpeg';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call login API
      const response = await authAPI.login({ email, password });

      if (response.success) {
        // Call parent's onLogin with user data
        onLogin({
          role: response.data.role,
          name: `${response.data.firstName} ${response.data.lastName}`,
          id: response.data._id,
          batch: response.data.danceInfo?.currentBatch || '',
          email: response.data.email,
          ...response.data,
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFFDF7 0%, #F5F1E8 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      padding: '3rem',
      width: '100%',
      maxWidth: '480px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      border: '2px solid #C9A961'
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem'
    },
    logo: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'contain',
      padding: '5px',
      border: '3px solid #C9A961',
      boxShadow: '0 4px 16px rgba(201, 169, 97, 0.3)',
      background: 'white'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#8B7355',
      textAlign: 'center',
      marginBottom: '0.5rem',
      lineHeight: '1.2'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#6B6B6B',
      textAlign: 'center',
      marginBottom: '2.5rem',
      fontWeight: '500'
    },
    error: {
      padding: '1rem',
      backgroundColor: '#FEE',
      color: '#C00',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      border: '2px solid #FCC',
      fontSize: '0.95rem',
      fontWeight: '500'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.9375rem',
      fontWeight: '700',
      color: '#8B7355',
      marginBottom: '0.5rem',
      letterSpacing: '0.02em'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      fontSize: '1rem',
      border: '2px solid #D4D4D4',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      backgroundColor: '#FFFDF7'
    },
    button: {
      width: '100%',
      padding: '1rem',
      fontSize: '1.0625rem',
      fontWeight: '700',
      color: '#1a1a1a',
      background: '#C9A961',
      border: '2px solid #C9A961',
      borderRadius: '12px',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '0.5rem',
      opacity: loading ? 0.7 : 1,
      boxShadow: '0 4px 16px rgba(201, 169, 97, 0.3)'
    },
    demo: {
      marginTop: '2.5rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #F5F1E8 0%, #FFFDF7 100%)',
      borderRadius: '16px',
      border: '2px solid #C9A961'
    },
    demoTitle: {
      fontSize: '0.9375rem',
      fontWeight: '800',
      color: '#8B7355',
      marginBottom: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '0.08em'
    },
    demoItem: {
      fontSize: '0.9375rem',
      color: '#6B6B6B',
      marginBottom: '0.625rem',
      fontWeight: '500'
    },
    demoNote: {
      fontSize: '0.85rem',
      marginTop: '1rem',
      color: '#8B7355',
      fontStyle: 'italic',
      paddingTop: '1rem',
      borderTop: '1px solid #C9A961'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
          <img src={fullLogo} alt="SDA Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>Samruddhi's Dance Academy</h1>
        <h2 style={styles.subtitle}>Namaste! Welcome</h2>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#C9A961'}
              onBlur={(e) => e.target.style.borderColor = '#D4D4D4'}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#C9A961'}
              onBlur={(e) => e.target.style.borderColor = '#D4D4D4'}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#B8935F';
                e.target.style.borderColor = '#B8935F';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(201, 169, 97, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#C9A961';
              e.target.style.borderColor = '#C9A961';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(201, 169, 97, 0.3)';
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.demo}>
          <p style={styles.demoTitle}>Demo Credentials</p>
          <p style={styles.demoItem}>🎓 Student: test@sda.com / password123</p>
          <p style={styles.demoItem}>👨‍🏫 Admin: admin@sda.com / admin123</p>
          <p style={styles.demoNote}>
            New students can register using the signup page
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;