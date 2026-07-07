import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import StudentDashboard from '../pages/student/Dashboard';
import StudentJobs from '../pages/student/Jobs';
import Applications from '../pages/student/Applications';
import Bookmarks from '../pages/student/Bookmarks';
import StudentProfile from '../pages/student/Profile';
import ManagerDashboard from '../pages/hiringManager/Dashboard';
import MyJobs from '../pages/hiringManager/MyJobs';
import Applicants from '../pages/hiringManager/Applicants';
import ManagerProfile from '../pages/hiringManager/Profile';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { navigate, pathForRole } from './router';

export default function AppRoutes() {
  const [path, setPath] = useState(window.location.pathname);
  const { user, loading } = useAuth();

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    if (!loading && user && (path === '/login' || path === '/register')) navigate(pathForRole(user.role));
  }, [loading, path, user]);

  return useMemo(() => {
    if (path === '/') return <Landing />;
    if (path === '/login') return <Login />;
    if (path === '/register') return <Register />;

    const student = (page) => <ProtectedRoute><RoleRoute role="STUDENT">{page}</RoleRoute></ProtectedRoute>;
    const manager = (page) => <ProtectedRoute><RoleRoute role="HIRING_MANAGER">{page}</RoleRoute></ProtectedRoute>;

    if (path === '/student/dashboard') return student(<StudentDashboard />);
    if (path === '/student/jobs') return student(<StudentJobs />);
    if (path === '/student/applications') return student(<Applications />);
    if (path === '/student/bookmarks') return student(<Bookmarks />);
    if (path === '/student/profile') return student(<StudentProfile />);
    if (path === '/manager/dashboard') return manager(<ManagerDashboard />);
    if (path === '/manager/my-jobs') return manager(<MyJobs />);
    if (path === '/manager/applicants') return manager(<Applicants />);
    if (path === '/manager/profile') return manager(<ManagerProfile />);
    return <NotFound />;
  }, [path]);
}
