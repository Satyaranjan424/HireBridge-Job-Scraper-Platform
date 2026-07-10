import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { navigate } from './router';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [loading, user]);

  if (loading) return <main className="grid min-h-screen place-items-center content-center gap-4 bg-[#f6f8fb] text-[#14213d]"><span className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#ffb73d]" />Preparing HireBridge</main>;
  if (!user) return null;
  return children;
}
