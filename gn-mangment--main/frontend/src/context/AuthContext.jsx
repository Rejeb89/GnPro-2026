import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { accessToken, user } = res.data;
      localStorage.setItem('token', accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setUser(user);
      return user;
    } catch (error) {
      console.error("Login service error:", error.response?.data || error.message);
      throw error;
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            const res = await axios.get(`${API_URL}/auth/me`);
            setUser(res.data.user);
          } catch (meError) {
            // Token might be expired
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            // Try auto-login after clearing invalid token
            await login('rejebmohamed@gn.com', 'rejebmohamed1989');
          }
        } else {
          // Auto-login with default admin account if no token found
          await login('rejebmohamed@gn.com', 'rejebmohamed1989');
        }
      } catch (err) {
        console.warn("Auto-login failed:", err.response?.data?.message || err.message);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {}
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
