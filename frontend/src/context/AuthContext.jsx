/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import { getToken } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function boot() {
      try {
        if (getToken()) setUser(await authApi.loadCurrentUser());
      } catch {
        localStorage.removeItem('hirebridge_token');
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  const value = useMemo(() => ({
    user,
    token: getToken(),
    role: user?.role,
    loading,
    setUser,
    async login(payload) {
      const nextUser = await authApi.login(payload);
      setUser(nextUser);
      return nextUser;
    },
    async register(payload) {
      const nextUser = await authApi.register(payload);
      setUser(nextUser);
      return nextUser;
    },
    async logout() {
      await authApi.logout();
      setUser(null);
    },
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
