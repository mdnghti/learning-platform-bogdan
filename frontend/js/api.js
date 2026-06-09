const API_BASE = 'http://localhost:5000/api';

const api = {
  getToken: () => localStorage.getItem('token'),

  setToken: (token) => localStorage.setItem('token', token),

  removeToken: () => localStorage.removeItem('token'),

  getHeaders: () => {
    const headers = { 'Content-Type': 'application/json' };
    const token = api.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  getUploadHeaders: () => {
    const headers = {};
    const token = api.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  request: async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...api.getHeaders(),
        ...options.headers,
      },
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    if (config.body instanceof FormData) {
      delete config.headers['Content-Type'];
      config.headers = { ...api.getUploadHeaders(), ...options.headers };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, ...data };
      }

      return data;
    } catch (error) {
      if (error.status === 401) {
        api.removeToken();
        window.location.href = '/pages/login.html';
      }
      throw error;
    }
  },

  get: (endpoint) => api.request(endpoint, { method: 'GET' }),

  post: (endpoint, body) => api.request(endpoint, { method: 'POST', body }),

  put: (endpoint, body) => api.request(endpoint, { method: 'PUT', body }),

  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),
};
