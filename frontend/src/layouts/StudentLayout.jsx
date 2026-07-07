import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ShellNav from '../components/layout/ShellNav';
import Topbar from '../components/layout/Topbar';
import { navigate, studentPath } from '../routes/router';

const nav = [
  { key: 'dashboard', label: 'Dashboard', path: studentPath('dashboard'), icon: 'grid' },
  { key: 'jobs', label: 'Jobs', path: studentPath('jobs'), icon: 'briefcase' },
  { key: 'applications', label: 'Applications', path: studentPath('applications'), icon: 'list' },
  { key: 'bookmarks', label: 'Bookmarks', path: studentPath('bookmarks'), icon: 'save' },
  { key: 'profile', label: 'Profile', path: studentPath('profile'), icon: 'user' },
];

export default function StudentLayout({ active, title, children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  async function signOut() {
    await logout();
    navigate('/');
  }

  return (
    <main className="app-shell">
      <ShellNav user={user} active={active} nav={nav} open={open} onClose={() => setOpen(false)} onLogout={signOut} />
      <section className="workspace">
        <Topbar title={title} user={user} onMenu={() => setOpen((value) => !value)} onLogout={signOut} />
        {children}
        <footer className="app-footer">HireBridge Student</footer>
      </section>
    </main>
  );
}
