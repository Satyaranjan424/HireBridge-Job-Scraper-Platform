import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { navigate, pathForRole } from './router';

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== role) navigate(pathForRole(user.role));
  }, [role, user]);

  if (!user || user.role !== role) return null;
  return children;
}
