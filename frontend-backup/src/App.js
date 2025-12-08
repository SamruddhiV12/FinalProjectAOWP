import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import Gallery from './components/Gallery';
import About from './components/About';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import AssignmentSubmission from './components/AssignmentSubmission';
import ReviewSubmissions from './components/ReviewSubmissions';
import ProgressReport from './components/ProgressReport';
import AttendanceHub from './components/AttendanceHub';
import StudyMaterials from './components/StudyMaterials';
import MockExam from './components/MockExam';
import Payments from './components/Payments';
import ClassManagement from './components/ClassManagement';
import StudentsList from './components/StudentsList';
import BatchManagement from './components/BatchManagement';
import StudentSchedule from './components/StudentSchedule';
import AdminPayments from './components/AdminPayments';
import AdminNotifications from './components/AdminNotifications';
import StudentProfile from './components/StudentProfile';
import ExamRecords from './components/ExamRecords';
import Navbar from './components/Navbar';
import { authAPI } from './services/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const loadUser = () => {
      const savedUser = authAPI.getCurrentUser();
      const token = localStorage.getItem('token');

      if (savedUser && token) {
        setUser(savedUser);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#8B0000'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <LandingPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />

          {/* Student Routes */}
          <Route path="/student" element={user?.role === 'student' ? <StudentDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/student-profile" element={user?.role === 'student' ? <StudentProfile user={user} /> : <Navigate to="/login" />} />
          <Route path="/exam-records" element={user?.role === 'student' ? <ExamRecords user={user} /> : <Navigate to="/login" />} />
          <Route path="/student-schedule" element={user?.role === 'student' ? <StudentSchedule user={user} /> : <Navigate to="/login" />} />
          <Route path="/assignment/:id" element={user?.role === 'student' ? <AssignmentSubmission user={user} /> : <Navigate to="/login" />} />
          <Route path="/progress" element={user?.role === 'student' ? <ProgressReport user={user} /> : <Navigate to="/login" />} />
          <Route path="/materials" element={user?.role === 'student' ? <StudyMaterials user={user} /> : <Navigate to="/login" />} />
          <Route path="/exam/:id" element={user?.role === 'student' ? <MockExam user={user} /> : <Navigate to="/login" />} />
          <Route path="/payments" element={user?.role === 'student' ? <Payments user={user} /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/students-list" element={user?.role === 'admin' ? <StudentsList /> : <Navigate to="/login" />} />
          <Route path="/batches" element={user?.role === 'admin' ? <BatchManagement /> : <Navigate to="/login" />} />
          <Route path="/review" element={user?.role === 'admin' ? <ReviewSubmissions user={user} /> : <Navigate to="/login" />} />
          <Route path="/attendance" element={user?.role === 'admin' ? <AttendanceHub user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin/materials" element={user?.role === 'admin' ? <StudyMaterials user={user} /> : <Navigate to="/login" />} />
          <Route path="/classes" element={user?.role === 'admin' ? <ClassManagement user={user} /> : <Navigate to="/login" />} />
          <Route path="/admin/payments" element={user?.role === 'admin' ? <AdminPayments /> : <Navigate to="/login" />} />
          <Route path="/admin/notifications" element={user?.role === 'admin' ? <AdminNotifications /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
