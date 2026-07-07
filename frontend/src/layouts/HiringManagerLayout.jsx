import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ShellNav from '../components/layout/ShellNav';
import Topbar from '../components/layout/Topbar';
import { managerPath, navigate } from '../routes/router';

const nav = [
  { key: 'dashboard', label: 'Dashboard', path: managerPath('dashboard'), icon: 'grid' },
  { key: 'my-jobs', label: 'My Jobs', path: managerPath('my-jobs'), icon: 'briefcase' },
  { key: 'applicants', label: 'Applicants', path: managerPath('applicants'), icon: 'users' },
  { key: 'profile', label: 'Profile', path: managerPath('profile'), icon: 'user' },
];

export default function HiringManagerLayout({ active, title, children }) {
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
        <footer className="app-footer">HireBridge Hiring Manager</footer>
      </section>
    </main>
  );
}
