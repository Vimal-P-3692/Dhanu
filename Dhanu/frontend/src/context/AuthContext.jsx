import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error('AuthContext: failed to read localStorage', e);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error('AuthContext: failed to save user', e);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.error('AuthContext: failed to remove user', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
