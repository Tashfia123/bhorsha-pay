import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Check if the user is already logged in
      const auth = localStorage.getItem('auth');
      if (auth) {
        const parsedAuth = JSON.parse(auth);
        setUser(parsedAuth.user);
        setToken(parsedAuth.token);
      }
    } catch (err) {
      console.error('Error checking auth state:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data;
        localStorage.setItem('auth', JSON.stringify({ user: newUser, token: newToken }));
        setUser(newUser);
        setToken(newToken);
        return newUser;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error.response?.data?.message || 'Login failed';
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (name, email, password, phone, nid, address, answer) => {
    setAuthLoading(true);
    setError(null);
    try {
      // Validate file upload
      if (!nid || !nid.name) {
        throw new Error('Please select an NID picture file');
      }

      // Validate file type
      if (!nid.type.startsWith('image/')) {
        throw new Error('Please select an image file (PNG, JPG, JPEG)');
      }

      // Validate file size (10MB limit)
      if (nid.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('nid', nid);
      formData.append('address', address);
      formData.append('answer', answer);

      console.log('📤 Sending registration data:', { name, email, phone, address, answer });
      console.log('📁 NID file:', { name: nid.name, type: nid.type, size: nid.size });

      const response = await axios.post('http://localhost:8080/api/v1/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setAuthLoading(true);
    try {
      localStorage.removeItem('auth');
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error('Error during logout:', err);
      setError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    authLoading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 