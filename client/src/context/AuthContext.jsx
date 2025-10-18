import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    if (user) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('user');
    }
  }, [user]);

  async function login(email, password) {
    const { data } = await axios.post(`${apiBase}/auth/login`, { email, password });
    setUser(data);
    return data;
  }

  async function register(payload) {
    const { data } = await axios.post(`${apiBase}/auth/register`, payload);
    setUser(data);
    return data;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
