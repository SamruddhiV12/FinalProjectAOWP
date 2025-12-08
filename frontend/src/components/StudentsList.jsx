import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/StudentsList.css';

function StudentsList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [stats, setStats] = useState({
    totalStudents: 0,
    basic: 0,
    intermediate: 0,
    advanced: 0,
  });

  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [selectedBatch, searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStudents(data.data);
        setFilteredStudents(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setStats({
          totalStudents: data.data.totalStudents,
          basic: data.data.batchDistribution.basic || 0,
          intermediate: data.data.batchDistribution.intermediate || 0,
          advanced: data.data.batchDistribution.advanced || 0,
        });
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (selectedBatch !== 'all') {
      filtered = filtered.filter(
        (student) => student.danceInfo?.currentBatch === selectedBatch
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  };

  const handleEditClick = (student) => {
    setEditingStudent(student._id);
    setEditFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      address: student.address?.street || '',
      city: student.address?.city || '',
      state: student.address?.state || '',
      pincode: student.address?.pincode || '',
      emergencyContactName: student.emergencyContact?.name || '',
      emergencyContactPhone: student.emergencyContact?.phone || '',
      emergencyContactRelation: student.emergencyContact?.relation || '',
      currentBatch: student.danceInfo?.currentBatch || 'basic',
      examsGiven: student.examInfo?.examsGiven || 0,
      nextExam: student.examInfo?.nextExam || '',
      examLevel: student.examInfo?.examLevel || 'None',
      isActive: student.isActive,
    });
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          phone: editFormData.phone,
          address: editFormData.address,
          city: editFormData.city,
          state: editFormData.state,
          pincode: editFormData.pincode,
          emergencyContactName: editFormData.emergencyContactName,
          emergencyContactPhone: editFormData.emergencyContactPhone,
          emergencyContactRelation: editFormData.emergencyContactRelation,
          danceInfo: {
            currentBatch: editFormData.currentBatch,
          },
          examInfo: {
            examsGiven: parseInt(editFormData.examsGiven) || 0,
            nextExam: editFormData.nextExam,
            examLevel: editFormData.examLevel,
          },
          isActive: editFormData.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditingStudent(null);
        setEditFormData({});
        fetchStudents(); // Refresh the list
        alert('Student updated successfully!');
      } else {
        alert('Failed to update student: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating student:', err);
      alert('Failed to update student');
    }
  };

  const calculateAge = (dateOfBirth) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="students-list-container">
        <div className="loading">Loading students...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="students-list-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="students-list-container">
      {/* Header */}
      <div className="students-header">
        <h1>👥 All Students</h1>
        <Link to="/admin" className="btn-back">← Back to Dashboard</Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>{stats.totalStudents}</h3>
          <p>Total Students</p>
        </div>
        <div className="stat-card basic">
          <h3>{stats.basic}</h3>
          <p>Basic Batch</p>
        </div>
        <div className="stat-card intermediate">
          <h3>{stats.intermediate}</h3>
          <p>Intermediate Batch</p>
        </div>
        <div className="stat-card advanced">
          <h3>{stats.advanced}</h3>
          <p>Advanced Batch</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="batch-filters">
          <button
            className={selectedBatch === 'all' ? 'active' : ''}
            onClick={() => setSelectedBatch('all')}
          >
            All Batches
          </button>
          <button
            className={selectedBatch === 'basic' ? 'active' : ''}
            onClick={() => setSelectedBatch('basic')}
          >
            Basic
          </button>
          <button
            className={selectedBatch === 'intermediate' ? 'active' : ''}
            onClick={() => setSelectedBatch('intermediate')}
          >
            Intermediate
          </button>
          <button
            className={selectedBatch === 'advanced' ? 'active' : ''}
            onClick={() => setSelectedBatch('advanced')}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        Showing {filteredStudents.length} of {students.length} students
      </div>

      {/* Students Table */}
      <div className="students-table-wrapper">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Parent Name</th>
              <th>Parent Phone</th>
              <th>Batch</th>
              <th>Exams Given</th>
              <th>Next Exam</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center', padding: '2rem' }}>
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                editingStudent === student._id ? (
                  // Edit Mode
                  <tr key={student._id} className="edit-row">
                    <td>
                      <input
                        type="text"
                        value={editFormData.firstName}
                        onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                        className="edit-input"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editFormData.lastName}
                        onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                        className="edit-input"
                        placeholder="Last Name"
                      />
                    </td>
                    <td>{student.email}</td>
                    <td>{calculateAge(student.dateOfBirth)} years</td>
                    <td>
                      <input
                        type="text"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                        className="edit-input"
                        placeholder="Phone"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editFormData.address}
                        onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                        className="edit-input"
                        placeholder="Street"
                      />
                      <input
                        type="text"
                        value={editFormData.city}
                        onChange={(e) => setEditFormData({...editFormData, city: e.target.value})}
                        className="edit-input"
                        placeholder="City"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editFormData.emergencyContactName}
                        onChange={(e) => setEditFormData({...editFormData, emergencyContactName: e.target.value})}
                        className="edit-input"
                        placeholder="Parent Name"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editFormData.emergencyContactPhone}
                        onChange={(e) => setEditFormData({...editFormData, emergencyContactPhone: e.target.value})}
                        className="edit-input"
                        placeholder="Parent Phone"
                      />
                    </td>
                    <td>
                      <select
                        value={editFormData.currentBatch}
                        onChange={(e) => setEditFormData({...editFormData, currentBatch: e.target.value})}
                        className="edit-select"
                      >
                        <option value="basic">Basic</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={editFormData.examsGiven}
                        onChange={(e) => setEditFormData({...editFormData, examsGiven: e.target.value})}
                        className="edit-input"
                        placeholder="Exams"
                      />
                    </td>
                    <td>
                      <select
                        value={editFormData.examLevel}
                        onChange={(e) => setEditFormData({...editFormData, examLevel: e.target.value})}
                        className="edit-select"
                      >
                        <option value="None">None</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Arangetram">Arangetram</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={editFormData.isActive}
                        onChange={(e) => setEditFormData({...editFormData, isActive: e.target.value === 'true'})}
                        className="edit-select"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleSaveEdit(student._id)} className="btn-save">Save</button>
                      <button onClick={handleCancelEdit} className="btn-cancel">Cancel</button>
                    </td>
                  </tr>
                ) : (
                  // View Mode
                  <tr key={student._id}>
                    <td className="student-name">
                      <strong>{student.firstName} {student.lastName}</strong>
                    </td>
                    <td>{student.email}</td>
                    <td>{calculateAge(student.dateOfBirth)} years</td>
                    <td>{student.phone}</td>
                    <td>
                      <div className="address-info">
                        <div>{student.address?.street}</div>
                        <div className="city-state">{student.address?.city}, {student.address?.state}</div>
                      </div>
                    </td>
                    <td>{student.emergencyContact?.name || '-'}</td>
                    <td>{student.emergencyContact?.phone || '-'}</td>
                    <td>
                      <span className={`batch-badge ${student.danceInfo?.currentBatch}`}>
                        {student.danceInfo?.currentBatch || 'N/A'}
                      </span>
                    </td>
                    <td>{student.examInfo?.examsGiven || 0}</td>
                    <td>{student.examInfo?.examLevel || 'None'}</td>
                    <td>
                      <span className={`status-badge ${student.isActive ? 'active' : 'inactive'}`}>
                        {student.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(student)} className="btn-edit">
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                )
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentsList;
