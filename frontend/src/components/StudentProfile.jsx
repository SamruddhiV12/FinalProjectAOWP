import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IMAGES } from '../constants/images';
import logoFull from '../assets/images/full-logo-sda.jpeg';
import '../styles/StudentProfile.css';

const StudentProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    danceInfo: {
      currentBatch: '',
      enrollmentDate: '',
      yearsOfExperience: 0
    },
    notifications: {
      email: true,
      sms: false,
      pushNotifications: true
    },
    profilePicture: IMAGES.local.studentPlaceholder
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student-profile`,
        config
      );

      if (res.data.success) {
        setProfileData(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student-profile/stats`,
        config
      );

      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('notifications.')) {
      const notifKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notifKey]: checked
        }
      }));
    } else if (name.startsWith('address.')) {
      const addressKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressKey]: value
        }
      }));
    } else if (name.startsWith('emergencyContact.')) {
      const contactKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [contactKey]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/student-profile`,
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          dateOfBirth: profileData.dateOfBirth,
          gender: profileData.gender,
          address: profileData.address.street,
          city: profileData.address.city,
          state: profileData.address.state,
          pincode: profileData.address.pincode,
          emergencyContactName: profileData.emergencyContact.name,
          emergencyContactPhone: profileData.emergencyContact.phone,
          emergencyContactRelation: profileData.emergencyContact.relation,
          notifications: profileData.notifications
        },
        config
      );

      if (res.data.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
        fetchProfile(); // Refresh the data
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>Loading profile...</div>;
  }

  if (error && !profileData.firstName) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>{error}</div>;
  }

  return (
    <div className="student-profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-brand">
            <div className="brand-logo">
              <img src={logoFull} alt="Samruddhi's Dance Academy" />
            </div>
            <div className="brand-copy">
              <p className="brand-eyebrow">My Profile</p>
              <h2>Samruddhi&apos;s Dance Academy</h2>
              <p className="brand-subtitle">Keep your information updated for a smoother experience.</p>
            </div>
          </div>
        </div>

        <div className="profile-header-content">
          <div className="profile-picture-section">
            <div className="profile-picture-wrapper">
              <img src={profileData.profilePicture || IMAGES.local.studentPlaceholder} alt="Profile" className="profile-picture" />
              {isEditing && (
                <label className="profile-picture-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                  <span className="upload-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </span>
                </label>
              )}
            </div>
          </div>

          <div className="profile-info-header">
            <h1>{profileData.firstName} {profileData.lastName}</h1>
            <p className="profile-batch">{profileData.danceInfo?.currentBatch || 'N/A'} Level Student</p>
            <p className="profile-member-since">
              Member since {profileData.danceInfo?.enrollmentDate ? new Date(profileData.danceInfo.enrollmentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
            </p>
          </div>

          <div className="profile-header-actions">
            {!isEditing ? (
              <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSubmit}>
                  <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Save
                </button>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                  <svg style={{ width: '16px', height: '16px', marginRight: '6px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        <div className="profile-grid">
          {/* Left Column */}
          <div className="profile-main">
            {/* Personal Information */}
            <div className="profile-section">
              <h2>Personal Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Address Information */}
            <div className="profile-section">
              <h2>Address</h2>
              <form>
                <div className="form-group">
                  <label>Street Address</label>
                  <textarea
                    name="address.street"
                    value={profileData.address?.street || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows="2"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={profileData.address?.city || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={profileData.address?.state || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={profileData.address?.pincode || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength="6"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Emergency Contact */}
            <div className="profile-section">
              <h2>Emergency Contact</h2>
              <form>
                <div className="form-group">
                  <label>Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={profileData.emergencyContact?.name || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyContact.phone"
                      value={profileData.emergencyContact?.phone || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      name="emergencyContact.relation"
                      value={profileData.emergencyContact?.relation || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Notification Preferences */}
            <div className="profile-section">
              <h2>Notification Preferences</h2>
              <div className="notification-options">
                <label className="notification-option">
                  <input
                    type="checkbox"
                    name="notifications.email"
                    checked={profileData.notifications.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <div className="notification-details">
                    <span className="notification-icon">📧</span>
                    <div>
                      <strong>Email Notifications</strong>
                      <p>Receive updates about classes, assignments, and announcements</p>
                    </div>
                  </div>
                </label>

                <label className="notification-option">
                  <input
                    type="checkbox"
                    name="notifications.sms"
                    checked={profileData.notifications.sms}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <div className="notification-details">
                    <span className="notification-icon">💬</span>
                    <div>
                      <strong>SMS Notifications</strong>
                      <p>Get important reminders via text message</p>
                    </div>
                  </div>
                </label>

                <label className="notification-option">
                  <input
                    type="checkbox"
                    name="notifications.pushNotifications"
                    checked={profileData.notifications.pushNotifications}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <div className="notification-details">
                    <span className="notification-icon">🔔</span>
                    <div>
                      <strong>Push Notifications</strong>
                      <p>Real-time alerts on your device</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="profile-sidebar">
            {/* Quick Stats */}
            <div className="profile-section stats-card">
              <h3>My Stats</h3>
              <div className="stat-item">
                <span className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </span>
                <div>
                  <strong>{stats?.attendance || 0}%</strong>
                  <p>Attendance</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                <div>
                  <strong>{stats?.assignmentsCompleted || 0}</strong>
                  <p>Assignments Complete</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </span>
                <div>
                  <strong>{stats?.examsGiven || 0}</strong>
                  <p>Exams Completed</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </span>
                <div>
                  <strong>{profileData.danceInfo?.yearsOfExperience || 0} Years</strong>
                  <p>Training Duration</p>
                </div>
              </div>
            </div>

            {/* Current Batch Info */}
            <div className="profile-section batch-card">
              <h3>Batch Information</h3>
              <div className="batch-details">
                <p><strong>Level:</strong> {profileData.danceInfo?.currentBatch || 'Not Assigned'}</p>
                <p><strong>Enrolled:</strong> {profileData.danceInfo?.enrollmentDate ? new Date(profileData.danceInfo.enrollmentDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Instructor:</strong> Guru Samruddhi</p>
                <p><strong>Total Classes:</strong> {stats?.totalClasses || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
