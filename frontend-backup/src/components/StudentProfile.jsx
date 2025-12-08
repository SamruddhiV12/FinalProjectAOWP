import React, { useState } from 'react';
import { IMAGES } from '../constants/images';
import '../styles/StudentProfile.css';

const StudentProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'student@sda.com',
    phone: '9876543210',
    dateOfBirth: '2005-03-15',
    gender: 'Female',

    // Address
    address: '123 Dance Street, Cultural District',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',

    // Emergency Contact
    emergencyContactName: 'Rajesh Sharma',
    emergencyContactPhone: '9876543211',
    emergencyContactRelation: 'Father',

    // Dance Info
    batch: 'Intermediate',
    enrollmentDate: '2022-06-15',
    yearsOfExperience: '3',

    // Preferences
    notifications: {
      email: true,
      sms: false,
      pushNotifications: true,
    },

    // Profile Picture
    profilePicture: IMAGES.local.studentPlaceholder,
  });

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'First Arangetram', date: '2024-11-15', icon: '🎭', description: 'Successfully completed debut performance' },
    { id: 2, title: 'State Competition Winner', date: '2024-08-20', icon: '🏆', description: 'First place in Intermediate category' },
    { id: 3, title: '100% Attendance', date: '2024-06-01', icon: '⭐', description: 'Perfect attendance for 6 months' },
    { id: 4, title: 'Theory Exam Excellence', date: '2024-03-10', icon: '📚', description: 'Scored 95% in Natyashastra exam' },
  ]);

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
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to update profile
    console.log('Updated profile:', profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
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

  return (
    <div className="student-profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-banner">
          <img src={IMAGES.bharatanatyam.stage1} alt="Banner" className="banner-image" />
        </div>

        <div className="profile-header-content">
          <div className="profile-picture-section">
            <div className="profile-picture-wrapper">
              <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
              {isEditing && (
                <label className="profile-picture-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                  <span className="upload-icon">📷</span>
                </label>
              )}
            </div>
          </div>

          <div className="profile-info-header">
            <h1>{profileData.firstName} {profileData.lastName}</h1>
            <p className="profile-batch">{profileData.batch} Level Student</p>
            <p className="profile-member-since">Member since {new Date(profileData.enrollmentDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="profile-header-actions">
            {!isEditing ? (
              <button className="btn-edit-profile" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSubmit}>💾 Save</button>
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>❌ Cancel</button>
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
                    name="address"
                    value={profileData.address}
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
                      name="city"
                      value={profileData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={profileData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={profileData.pincode}
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
                    name="emergencyContactName"
                    value={profileData.emergencyContactName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={profileData.emergencyContactPhone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <input
                      type="text"
                      name="emergencyContactRelation"
                      value={profileData.emergencyContactRelation}
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
                <span className="stat-icon">📅</span>
                <div>
                  <strong>87%</strong>
                  <p>Attendance</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">✅</span>
                <div>
                  <strong>12/15</strong>
                  <p>Assignments Complete</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <div>
                  <strong>4.5/5</strong>
                  <p>Average Score</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📈</span>
                <div>
                  <strong>{profileData.yearsOfExperience} Years</strong>
                  <p>Training Duration</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="profile-section achievements-card">
              <h3>Achievements</h3>
              <div className="achievements-list">
                {achievements.map(achievement => (
                  <div key={achievement.id} className="achievement-item">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-details">
                      <strong>{achievement.title}</strong>
                      <p>{achievement.description}</p>
                      <span className="achievement-date">
                        {new Date(achievement.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Batch Info */}
            <div className="profile-section batch-card">
              <h3>Batch Information</h3>
              <div className="batch-details">
                <p><strong>Level:</strong> {profileData.batch}</p>
                <p><strong>Schedule:</strong> Mon, Wed, Fri</p>
                <p><strong>Timing:</strong> 6:00 PM - 7:30 PM</p>
                <p><strong>Instructor:</strong> Guru Samruddhi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
