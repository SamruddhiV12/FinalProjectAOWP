import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/StudyMaterials.css';

function StudyMaterials({ user }) {
  const [materials, setMaterials] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [uploadMode, setUploadMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Theory');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    fetchMaterials();
    if (user.role === 'admin') {
      fetchBatches();
    }
  }, [user.role]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchMaterials = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/materials', {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMaterials(data.data);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/batches?isActive=true', {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setBatches(data.data);
      }
    } catch (err) {
      console.error('Error fetching batches:', err);
    }
  };

  const categories = ['All', 'Theory', 'Practice Videos', 'Exam Prep', 'Reference', 'Other'];

  const filteredMaterials =
    selectedCategory === 'All'
      ? materials
      : materials.filter((m) => m.category === selectedCategory);

  const toggleBatch = (batchId) => {
    if (selectedBatches.includes(batchId)) {
      setSelectedBatches(selectedBatches.filter((id) => id !== batchId));
    } else {
      setSelectedBatches([...selectedBatches, batchId]);
    }
  };

  const handleSelectAllBatches = () => {
    setSelectedBatches(batches.map((b) => b._id));
  };

  const handleClearBatches = () => {
    setSelectedBatches([]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    if (!title.trim() || !fileUrl.trim() || !fileName.trim()) {
      setStatusMessage('⚠️ Please fill in all required fields');
      return;
    }

    if (!isPublic && selectedBatches.length === 0) {
      setStatusMessage('⚠️ Please select at least one batch or make material public');
      return;
    }

    setUploading(true);

    try {
      const res = await fetch('http://localhost:5001/api/materials', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title,
          description,
          category,
          fileUrl,
          fileName,
          fileType,
          batchIds: selectedBatches,
          isPublic,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage('✓ Material uploaded successfully!');
        resetForm();
        fetchMaterials();
        setTimeout(() => {
          setUploadMode(false);
          setStatusMessage('');
        }, 2000);
      } else {
        setStatusMessage(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setStatusMessage('⚠️ Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const data = await res.json();

      if (data.success) {
        fetchMaterials();
      } else {
        alert('Failed to delete material');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete material');
    }
  };

  const handleDownload = async (material) => {
    try {
      await fetch(`http://localhost:5001/api/materials/${material._id}/download`, {
        method: 'PATCH',
        headers: authHeaders(),
      });

      // Open the file URL
      window.open(material.fileUrl, '_blank');
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Theory');
    setSelectedBatches([]);
    setIsPublic(false);
    setFileUrl('');
    setFileName('');
    setFileType('');
  };

  if (loading) {
    return (
      <div className="materials-page">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="materials-page">
      <div className="materials-header">
        <div>
          <h1>📚 Study Materials</h1>
          <p className="materials-subtitle">
            {user.role === 'admin'
              ? 'Upload and manage study materials for your batches'
              : 'Access study materials for your classes'}
          </p>
        </div>
        <div className="header-actions">
          {user.role === 'admin' && (
            <button
              onClick={() => setUploadMode(!uploadMode)}
              className={`btn-upload ${uploadMode ? 'active' : ''}`}
            >
              {uploadMode ? 'Cancel Upload' : '+ Upload Material'}
            </button>
          )}
          <Link
            to={user.role === 'admin' ? '/admin' : '/student'}
            className="btn-back"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Upload Form (Admin Only) */}
      {user.role === 'admin' && uploadMode && (
        <div className="upload-section">
          <h2>Upload New Material</h2>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-row">
              <div className="form-group full-width">
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Jatiswaram Practice Guide"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Theory">Theory</option>
                  <option value="Practice Videos">Practice Videos</option>
                  <option value="Exam Prep">Exam Prep</option>
                  <option value="Reference">Reference</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>File Type *</label>
                <select value={fileType} onChange={(e) => setFileType(e.target.value)} required>
                  <option value="">Select type...</option>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="Document">Document</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of the material..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>File URL *</label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/... or https://youtu.be/..."
                  required
                />
                <small className="form-hint">Google Drive, YouTube, or direct file link</small>
              </div>

              <div className="form-group">
                <label>File Name *</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g., adavu-tutorial.pdf"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span>Make this material visible to all students</span>
              </label>
            </div>

            {!isPublic && (
              <div className="batch-selection">
                <label>Select Batches (Required if not public) *</label>
                <div className="batch-actions">
                  <button type="button" className="btn-chip" onClick={handleSelectAllBatches}>
                    Select All
                  </button>
                  <button type="button" className="btn-chip secondary" onClick={handleClearBatches}>
                    Clear
                  </button>
                  <span className="batch-count">
                    {selectedBatches.length} batch{selectedBatches.length !== 1 ? 'es' : ''} selected
                  </span>
                </div>

                <div className="batch-grid">
                  {batches.map((batch) => (
                    <label key={batch._id} className="batch-card">
                      <input
                        type="checkbox"
                        checked={selectedBatches.includes(batch._id)}
                        onChange={() => toggleBatch(batch._id)}
                      />
                      <div className="batch-info">
                        <div className="batch-name">{batch.name}</div>
                        <div className="batch-details">
                          {batch.level} • {batch.students?.length || 0} students
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {statusMessage && (
              <div className={`status-message ${statusMessage.startsWith('✓') ? 'success' : 'error'}`}>
                {statusMessage}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Material'}
            </button>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials List */}
      <div className="materials-grid">
        {filteredMaterials.length === 0 ? (
          <div className="no-materials">
            <div className="no-materials-icon">📭</div>
            <div className="no-materials-text">
              {selectedCategory === 'All'
                ? 'No materials uploaded yet'
                : `No materials found in "${selectedCategory}" category`}
            </div>
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <div key={material._id} className="material-card">
              <div className="material-header">
                <span className="material-category">{material.category}</span>
                <span className="material-type">{material.fileType}</span>
              </div>

              <h3 className="material-title">{material.title}</h3>

              {material.description && (
                <p className="material-description">{material.description}</p>
              )}

              <div className="material-meta">
                {material.isPublic ? (
                  <span className="material-badge public">🌐 Public</span>
                ) : (
                  <span className="material-badge batches">
                    📚 {material.batches?.length || 0} batch{material.batches?.length !== 1 ? 'es' : ''}
                  </span>
                )}
                <span className="material-downloads">
                  📥 {material.downloads} download{material.downloads !== 1 ? 's' : ''}
                </span>
              </div>

              {material.batches && material.batches.length > 0 && !material.isPublic && (
                <div className="material-batches">
                  {material.batches.map((batch) => (
                    <span key={batch._id} className="batch-tag">
                      {batch.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="material-footer">
                <span className="material-date">
                  {new Date(material.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="material-actions">
                <button className="btn-download" onClick={() => handleDownload(material)}>
                  📥 Download
                </button>
                {user.role === 'admin' && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(material._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudyMaterials;
