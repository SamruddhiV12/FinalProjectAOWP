// API Service for Backend Communication

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

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

export const authAPI = {
  signup: async (userData) => {
    const response = await apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response;
  },

  login: async (credentials) => {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    return await apiCall('/api/auth/me');
  },

  updateProfile: async (profileData) => {
    return await apiCall('/api/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  updatePassword: async (passwordData) => {
    return await apiCall('/api/auth/update-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

export { API_URL };

export default apiCall;
