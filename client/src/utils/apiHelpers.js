/**
 * Utility functions for API communications in the application
 */

import axios from 'axios';

// Create an axios instance with common configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds
});

/**
 * Attaches auth token to requests
 * @param {string} token - JWT or other auth token
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

/**
 * Initializes auth from localStorage on app start
 */
export const initializeAuth = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    setAuthToken(token);
  }
};

/**
 * Makes a GET request
 * @param {string} url - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Response data
 */
export const get = async (url, params = {}) => {
  try {
    const response = await apiClient.get(url, { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Makes a POST request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} - Response data
 */
export const post = async (url, data = {}) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Makes a PUT request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} - Response data
 */
export const put = async (url, data = {}) => {
  try {
    const response = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Makes a PATCH request
 * @param {string} url - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<Object>} - Response data
 */
export const patch = async (url, data = {}) => {
  try {
    const response = await apiClient.patch(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Makes a DELETE request
 * @param {string} url - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Response data
 */
export const del = async (url, params = {}) => {
  try {
    const response = await apiClient.delete(url, { params });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Handles API errors
 * @param {Error} error - Error object from axios
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with an error status code
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
    
    // Handle 401 Unauthorized errors
    if (error.response.status === 401) {
      setAuthToken(null); // Clear invalid token
      // You might want to redirect to login page here
    }
  } else if (error.request) {
    // Request was made but no response received
    console.error('API Error Request:', error.request);
  } else {
    // Error in setting up the request
    console.error('API Error Message:', error.message);
  }
};

/**
 * Handles file uploads with progress tracking
 * @param {string} url - API endpoint
 * @param {FormData} formData - Form data with files
 * @param {Function} onProgress - Progress callback (percentage)
 * @returns {Promise<Object>} - Response data
 */
export const uploadFile = async (url, formData, onProgress) => {
  try {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) {
          onProgress(percentCompleted);
        }
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Makes multiple concurrent API requests
 * @param {Array<Object>} requests - Array of request objects
 * @param {string} requests[].method - HTTP method (GET, POST, etc.)
 * @param {string} requests[].url - API endpoint
 * @param {Object} requests[].data - Request body (for POST, PUT, etc.)
 * @param {Object} requests[].params - Query parameters (for GET, DELETE)
 * @returns {Promise<Array<Object>>} - Array of responses
 */
export const batchRequests = async (requests) => {
  try {
    const requestPromises = requests.map(req => {
      const method = req.method.toLowerCase();
      
      switch (method) {
        case 'get':
          return apiClient.get(req.url, { params: req.params });
        case 'post':
          return apiClient.post(req.url, req.data);
        case 'put':
          return apiClient.put(req.url, req.data);
        case 'patch':
          return apiClient.patch(req.url, req.data);
        case 'delete':
          return apiClient.delete(req.url, { params: req.params });
        default:
          throw new Error(`Unsupported method: ${req.method}`);
      }
    });
    
    const responses = await Promise.all(requestPromises);
    return responses.map(response => response.data);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Creates a cancelable request using a cancel token
 * @param {Function} requestFn - API request function (get, post, etc.)
 * @param {Array} requestArgs - Arguments for the request function
 * @returns {Object} - Object with request promise and cancel function
 */
export const createCancelableRequest = (requestFn, ...requestArgs) => {
  const cancelSource = axios.CancelToken.source();
  
  const requestPromise = requestFn(...requestArgs, {
    cancelToken: cancelSource.token
  });
  
  return {
    promise: requestPromise,
    cancel: () => cancelSource.cancel('Request canceled')
  };
};

/**
 * Fetches with retry capability
 * @param {Function} requestFn - API request function (get, post, etc.)
 * @param {Array} requestArgs - Arguments for the request function
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries
 * @param {number} options.retryDelay - Delay between retries in ms
 * @returns {Promise<Object>} - Response data
 */
export const fetchWithRetry = async (requestFn, requestArgs, options = {}) => {
  const maxRetries = options.maxRetries || 3;
  const retryDelay = options.retryDelay || 1000;
  
  let attempts = 0;
  let lastError = null;
  
  while (attempts < maxRetries) {
    try {
      return await requestFn(...requestArgs);
    } catch (error) {
      lastError = error;
      attempts++;
      
      if (attempts >= maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  
  throw lastError;
};

/**
 * Caches API responses in localStorage
 * @param {string} url - API endpoint
 * @param {Object} params - Request parameters
 * @param {Function} fetchFn - Function to fetch data
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Cache time to live in milliseconds
 * @returns {Promise<Object>} - Response data
 */
export const cachedFetch = async (url, params, fetchFn, options = {}) => {
  const ttl = options.ttl || 60 * 1000; // Default 1 minute
  const cacheKey = `api_cache_${url}_${JSON.stringify(params)}`;
  
  try {
    // Check for cached data
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);
      const age = Date.now() - timestamp;
      
      // Return cached data if it's still fresh
      if (age < ttl) {
        return data;
      }
    }
    
    // Fetch fresh data
    const data = await fetchFn();
    
    // Cache the new data
    localStorage.setItem(cacheKey, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
    
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Gets the cache status of a request
 * @param {string} url - API endpoint
 * @param {Object} params - Request parameters
 * @param {number} ttl - Cache time to live in milliseconds
 * @returns {Object} - Cache status information
 */
export const getCacheStatus = (url, params, ttl = 60 * 1000) => {
  const cacheKey = `api_cache_${url}_${JSON.stringify(params)}`;
  const cachedData = localStorage.getItem(cacheKey);
  
  if (!cachedData) {
    return {
      isCached: false,
      age: null,
      isExpired: true
    };
  }
  
  try {
    const { timestamp } = JSON.parse(cachedData);
    const age = Date.now() - timestamp;
    
    return {
      isCached: true,
      age,
      isExpired: age >= ttl
    };
  } catch (error) {
    return {
      isCached: false,
      age: null,
      isExpired: true,
      error
    };
  }
};

/**
 * Clears all API cache entries from localStorage
 */
export const clearApiCache = () => {
  const cacheKeyPrefix = 'api_cache_';
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(cacheKeyPrefix)) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Wrapper for API endpoints
 */
export const endpoints = {
  auth: {
    login: (credentials) => post('/auth/login', credentials),
    register: (userData) => post('/auth/register', userData),
    logout: () => post('/auth/logout'),
    refreshToken: () => post('/auth/refresh-token')
  },
  
  campaigns: {
    getAll: (params) => get('/campaigns', params),
    getById: (id) => get(`/campaigns/${id}`),
    create: (campaign) => post('/campaigns', campaign),
    update: (id, campaign) => put(`/campaigns/${id}`, campaign),
    delete: (id) => del(`/campaigns/${id}`),
    donate: (id, amount) => post(`/campaigns/${id}/donate`, { amount })
  },
  
  users: {
    getCurrent: () => get('/users/me'),
    update: (userData) => put('/users/me', userData),
    getById: (id) => get(`/users/${id}`),
    getDonations: () => get('/users/me/donations')
  },
  
  stats: {
    getDashboard: () => get('/stats/dashboard'),
    getCampaignStats: (id) => get(`/stats/campaigns/${id}`),
    getGlobalStats: () => get('/stats/global')
  },
  
  notifications: {
    getAll: () => get('/notifications'),
    markAsRead: (id) => put(`/notifications/${id}/read`),
    markAllAsRead: () => put('/notifications/read-all')
  }
}; 