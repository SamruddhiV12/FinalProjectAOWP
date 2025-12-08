import React from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from './NotificationBell';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>🎭 Samruddhi's Dance Academy</h2>
      </div>

      <div className="nav-links">
        {user.role === 'student' ? (
          <>
            <Link to="/student">Dashboard</Link>
            <Link to="/student-profile">My Profile</Link>
            <Link to="/exam-records">Exam Records</Link>
            <Link to="/materials">Study Materials</Link>
            <Link to="/progress">My Progress</Link>
            <Link to="/payments">Payments</Link>
          </>
        ) : (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/attendance">Attendance</Link>
            <Link to="/classes">Classes</Link>
            <Link to="/review">Reviews</Link>
            <Link to="/admin/materials">Materials</Link>
            <Link to="/admin/notifications">Notifications</Link>
          </>
        )}
      </div>

      <div className="nav-user">
        <NotificationBell user={user} />
        <span>Namaste, {user.name}</span>
        <button onClick={onLogout} className="btn-logout">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
