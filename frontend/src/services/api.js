// API Service for Backend Communication

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type') || '';
    let data;
    try {
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        if (text) {
          throw new Error(text);
        }
        throw new Error(`Unexpected empty response (status ${response.status})`);
      }
    } catch (parseErr) {
      console.error('API parse error:', parseErr);
      throw new Error(`Failed to parse response (status ${response.status})`);
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication APIs
export const authAPI = {
  // Signup
  signup: async (userData) => {
    const response = await apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store token in localStorage
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response;
  },

  // Login
  login: async (credentials) => {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token in localStorage
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user profile
  getMe: async () => {
    return await apiCall('/api/auth/me');
  },

  // Update profile
  updateProfile: async (profileData) => {
    return await apiCall('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update password
  updatePassword: async (passwordData) => {
    return await apiCall('/api/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Get user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

// Export API URL for other uses
export { API_URL };

export default apiCall;
