import axios from 'axios';
import { Platform } from 'react-native';

// Change this to your backend URL
// Options:
// 1. USB Cable (Recommended): Use localhost with ADB port forwarding
//    - Run: adb reverse tcp:3000 tcp:3000
//    - Then use: 'http://localhost:3000'
// 2. Same network: Use your computer's IP (e.g., http://192.168.1.100:3000)
// 3. Different network: Use ngrok URL (e.g., https://abc123.ngrok-free.app)
// 4. Production: Use your deployed backend URL
// Try 127.0.0.1 if localhost doesn't work
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.0.105:3000'  // ✅ For USB connection (try 127.0.0.1 instead of localhost)
  : 'https://your-backend-url.com'; 
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Debug logging
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📍 Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.message);
    console.error('📍 URL:', error.config?.url);
    console.error('📍 Base URL:', error.config?.baseURL);
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timed out after', error.config?.timeout, 'ms');
    }
    if (error.response?.status === 401) {
      // Token expired or invalid - clear token
      clearAuthToken();
    }
    return Promise.reject(error);
  }
);

// Token storage helpers
const getAuthToken = () => {
  // In a real app, use SecureStore or AsyncStorage
  // For now, using a simple approach
  try {
    return global.authToken || null;
  } catch (error) {
    return null;
  }
};

const setAuthToken = (token) => {
  global.authToken = token;
};

const clearAuthToken = () => {
  delete global.authToken;
};

// Test API connection
export const testConnection = async () => {
  try {
    console.log('🧪 Testing API connection to:', API_BASE_URL);
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000,
    });
    console.log('✅ Connection test successful:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('📍 Full error:', error);
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timed out');
    }
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('🔌 Cannot connect to server. Check:');
      console.error('   1. Backend is running');
      console.error('   2. Port forwarding is active: adb reverse tcp:3000 tcp:3000');
      console.error('   3. API_BASE_URL is correct:', API_BASE_URL);
    }
    return { success: false, error: error.message };
  }
};

// Auth API
export const authAPI = {
  register: async (email, password) => {
    try {
      console.log('📝 Attempting registration...');
      const response = await api.post('/auth/register', { email, password });
      console.log('✅ Registration response:', response.status);
      if (response.data.session?.access_token) {
        setAuthToken(response.data.session.access_token);
      }
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      console.error('📍 Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Login response:', response.status);
      if (response.data.access_token) {
        setAuthToken(response.data.access_token);
      }
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error.message);
      console.error('📍 Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    clearAuthToken();
  },
};

// Organizations API
export const orgsAPI = {
  create: async (name, type, team_strength, logo) => {
    const response = await api.post('/orgs', {
      name,
      type,
      team_strength,
      logo,
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/orgs');
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  create: async (orgId, name, description) => {
    const response = await api.post(`/orgs/${orgId}/projects`, {
      name,
      description,
    });
    return response.data;
  },

  getByOrg: async (orgId) => {
    const response = await api.get(`/orgs/${orgId}/projects`);
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  upload: async (projectId, fileUri, fileName, fileType) => {
    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? fileUri : fileUri.replace('file://', ''),
      name: fileName,
      type: fileType || 'application/octet-stream',
    });

    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/projects/${projectId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );
    return response.data;
  },

  getByProject: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/documents`);
    return response.data;
  },

  extract: async (documentId) => {
    const response = await api.post(`/documents/${documentId}/extract`);
    return response.data;
  },
};

export default api;

