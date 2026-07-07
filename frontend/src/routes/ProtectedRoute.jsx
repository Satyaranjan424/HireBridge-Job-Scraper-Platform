import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { navigate } from './router';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user]);

  if (loading) return <main className="loading-page"><span />Preparing HireBridge</main>;
  if (!user) return null;
  return children;
}
