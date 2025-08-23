import axios from 'axios';

// Define base URL as relative to enable proxy in development
// or use the full URL in production
const API = axios.create({
  // Using relative URL enables Vite's proxy to work
  baseURL: '/api/v1'
});

// Add a request interceptor to include the token in all requests
API.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { token } = JSON.parse(auth);
      if (token) {
        config.headers.Authorization = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Blog-related API calls
export const getAllBlogs = async () => {
  try {
    const response = await API.get('/blogs/all');
    return response.data.blogs;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

export const getBlogById = async (id) => {
  try {
    const response = await API.get(`/blogs/${id}`);
    return response.data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};

export const getBlogsByCampaign = async (campaignId) => {
  try {
    const response = await API.get(`/blogs/campaign/${campaignId}`);
    return response.data.blogs;
  } catch (error) {
    console.error('Error fetching blogs by campaign:', error);
    throw error;
  }
};

export const createBlog = async (blogData) => {
  try {
    const response = await API.post('/blogs/create', blogData);
    return response.data.blog;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    const response = await API.put(`/blogs/${id}`, blogData);
    return response.data.blog;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await API.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};

export const addComment = async (blogId, content) => {
  try {
    const response = await API.post(`/blogs/${blogId}/comment`, { content });
    return response.data.blog;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const likeBlog = async (blogId) => {
  try {
    const response = await API.post(`/blogs/${blogId}/like`);
    return response.data.likes;
  } catch (error) {
    console.error('Error liking blog:', error);
    throw error;
  }
};

export const getUserBlogs = async () => {
  try {
    const response = await API.get('/blogs/user/blogs');
    return response.data.blogs;
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    throw error;
  }
};

export const getSpecificUserBlogs = async (userId) => {
  try {
    const response = await API.get(`/blogs/user/${userId}`);
    return response.data.blogs;
  } catch (error) {
    console.error('Error fetching specific user blogs:', error);
    throw error;
  }
}; 