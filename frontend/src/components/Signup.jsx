import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants/images';
import { authAPI } from '../services/api';
import '../styles/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',

    // Address
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',

    // Dance Experience
    hasPriorExperience: 'no',
    yearsOfExperience: '',
    previousInstitution: '',
    preferredBatch: 'basic',

    // Account
    password: '',
    confirmPassword: '',

    // Terms
    agreeToTerms: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSteps = 4;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }

    if (step === 2) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
      if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
      if (!formData.emergencyContactPhone.trim()) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      } else if (!/^\d{10}$/.test(formData.emergencyContactPhone)) {
        newErrors.emergencyContactPhone = 'Phone number must be 10 digits';
      }
      if (!formData.emergencyContactRelation.trim()) newErrors.emergencyContactRelation = 'Relationship is required';
    }

    if (step === 3) {
      if (formData.hasPriorExperience === 'yes' && !formData.yearsOfExperience) {
        newErrors.yearsOfExperience = 'Years of experience is required';
      }
      if (!formData.preferredBatch) newErrors.preferredBatch = 'Preferred batch is required';
    }

    if (step === 4) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.agreeToTerms) {
        newErrors.agreeToTerms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateStep(currentStep)) {
      setLoading(true);

      try {
        // Call signup API
        const response = await authAPI.signup(formData);

        if (response.success) {
          // Show success message
          alert('Registration successful! You are now logged in.');

          // Redirect to student dashboard
          navigate('/student');

          // Reload to update app state
          window.location.reload();
        }
      } catch (error) {
        console.error('Signup error:', error);

        // Show error message
        if (error.message.includes('already exists')) {
          setErrors({ email: 'This email is already registered' });
          setCurrentStep(1); // Go back to step 1
        } else {
          alert('Registration failed: ' + (error.message || 'Please try again'));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Personal Information</h2>
            <p className="step-description">Tell us about yourself</p>

            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={errors.dateOfBirth ? 'error' : ''}
                />
                {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange}
                  />
                  <span>Female</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                  />
                  <span>Male</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === 'Other'}
                    onChange={handleChange}
                  />
                  <span>Other</span>
                </label>
              </div>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2>Address & Emergency Contact</h2>
            <p className="step-description">Where can we reach you?</p>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="3"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={errors.state ? 'error' : ''}
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  className={errors.pincode ? 'error' : ''}
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>

            <div className="section-divider">
              <span>Emergency Contact Information</span>
            </div>

            <div className="form-group">
              <label>Contact Name *</label>
              <input
                type="text"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                placeholder="Emergency contact person"
                className={errors.emergencyContactName ? 'error' : ''}
              />
              {errors.emergencyContactName && <span className="error-message">{errors.emergencyContactName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact Phone *</label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  className={errors.emergencyContactPhone ? 'error' : ''}
                />
                {errors.emergencyContactPhone && <span className="error-message">{errors.emergencyContactPhone}</span>}
              </div>

              <div className="form-group">
                <label>Relationship *</label>
                <select
                  name="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={handleChange}
                  className={errors.emergencyContactRelation ? 'error' : ''}
                >
                  <option value="">Select relationship</option>
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="spouse">Spouse</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
                {errors.emergencyContactRelation && <span className="error-message">{errors.emergencyContactRelation}</span>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h2>Dance Experience</h2>
            <p className="step-description">Tell us about your dance journey</p>

            <div className="form-group">
              <label>Do you have prior dance experience? *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasPriorExperience"
                    value="no"
                    checked={formData.hasPriorExperience === 'no'}
                    onChange={handleChange}
                  />
                  <span>No, I'm a beginner</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="hasPriorExperience"
                    value="yes"
                    checked={formData.hasPriorExperience === 'yes'}
                    onChange={handleChange}
                  />
                  <span>Yes, I have prior experience</span>
                </label>
              </div>
            </div>

            {formData.hasPriorExperience === 'yes' && (
              <>
                <div className="form-group">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    placeholder="Number of years"
                    min="0"
                    className={errors.yearsOfExperience ? 'error' : ''}
                  />
                  {errors.yearsOfExperience && <span className="error-message">{errors.yearsOfExperience}</span>}
                </div>

                <div className="form-group">
                  <label>Previous Institution (Optional)</label>
                  <input
                    type="text"
                    name="previousInstitution"
                    value={formData.previousInstitution}
                    onChange={handleChange}
                    placeholder="Name of previous dance school"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Preferred Batch Level *</label>
              <select
                name="preferredBatch"
                value={formData.preferredBatch}
                onChange={handleChange}
                className={errors.preferredBatch ? 'error' : ''}
              >
                <option value="basic">Basic (Beginners - No prior experience)</option>
                <option value="intermediate">Intermediate (1-3 years experience)</option>
                <option value="advanced">Advanced (3+ years experience)</option>
              </select>
              {errors.preferredBatch && <span className="error-message">{errors.preferredBatch}</span>}
              <small className="help-text">Note: Final batch placement will be determined after evaluation</small>
            </div>

            <div className="info-card">
              <div className="info-icon">ℹ️</div>
              <div className="info-content">
                <h4>What to Expect</h4>
                <ul>
                  <li>All new students undergo a brief evaluation session</li>
                  <li>Classes are held 3 times per week (2 hours each)</li>
                  <li>Annual performance opportunities</li>
                  <li>Regular assessments and feedback</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h2>Account Setup</h2>
            <p className="step-description">Create your login credentials</p>

            <div className="form-group">
              <label>Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
              <small className="help-text">Minimum 6 characters</small>
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span>
                  I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a> *
                </span>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            </div>

            <div className="summary-card">
              <h3>Registration Summary</h3>
              <div className="summary-item">
                <span className="summary-label">Name:</span>
                <span className="summary-value">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Email:</span>
                <span className="summary-value">{formData.email}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Phone:</span>
                <span className="summary-value">{formData.phone}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Preferred Batch:</span>
                <span className="summary-value">{formData.preferredBatch}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <img src={IMAGES.temple.main} alt="Background" />
      </div>

      <div className="signup-content">
        <div className="signup-card">
          {/* Header */}
          <div className="signup-header">
            <img src={IMAGES.local.logo} alt="SDA Logo" className="signup-logo" />
            <h1>Join Samruddhi's Dance Academy</h1>
            <p>Begin your journey in classical Bharatanatyam</p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`progress-step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > step ? '✓' : step}
                </div>
                <div className="step-label">
                  {step === 1 && 'Personal'}
                  {step === 2 && 'Contact'}
                  {step === 3 && 'Experience'}
                  {step === 4 && 'Account'}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn-secondary">
                  ← Previous
                </button>
              )}

              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep} className="btn-primary">
                  Next →
                </button>
              ) : (
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="signup-footer">
            <p>Already have an account? <a href="/login">Login here</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
