import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => apiClient.getUser());
  const [token, setToken] = useState(() => apiClient.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const storedToken = apiClient.getToken();
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const currentUser = await authApi.getMe();
        if (isMounted) {
          setUser(currentUser);
          setToken(storedToken);
        }
      } catch (err) {
        // Token invalid or expired
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    const handleAuthCleared = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('marketlink:auth-cleared', handleAuthCleared);
    return () => {
      isMounted = false;
      window.removeEventListener('marketlink:auth-cleared', handleAuthCleared);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    const authData = res.data;
    setUser(authData.user);
    setToken(authData.token);
    return authData;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authApi.register(userData);
    const authData = res.data;
    setUser(authData.user);
    setToken(authData.token);
    return authData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setToken(null);
    }
  }, []);

  const role = user?.role || null;
  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
