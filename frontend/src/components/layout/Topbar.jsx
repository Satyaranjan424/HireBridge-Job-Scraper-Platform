import { useState } from 'react';
import Icon from '../ui/Icons';

export default function Topbar({ title, user, onMenu, onLogout }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="menu-button icon-button" onClick={onMenu} aria-label="Open menu"><Icon name="menu" /></button>
      <div>
        <div className="topbar-logo">HireBridge</div>
        <span className="eyebrow">{user.role === 'HIRING_MANAGER' ? 'Recruiting workspace' : 'Student workspace'}</span>
        <h1>{title}</h1>
      </div>
      <div className="topbar-tools">
        <div className={`search-control ${searchOpen ? 'open' : ''}`}>
          {searchOpen && <input autoFocus placeholder="Search dashboard" aria-label="Search dashboard" />}
          <button className="icon-button" type="button" onClick={() => setSearchOpen((value) => !value)} aria-label="Search"><Icon name="search" /></button>
        </div>
        <div className="dropdown-wrap">
          <button className="icon-button" type="button" onClick={() => setNoticeOpen((value) => !value)} aria-label="Notifications"><Icon name="bell" /></button>
          {noticeOpen && (
            <div className="dropdown-panel compact">
              <strong>Notifications</strong>
              <p>No new alerts. Your latest activity will appear here.</p>
            </div>
          )}
        </div>
        <div className="dropdown-wrap">
          <button className="profile-button" type="button" onClick={() => setProfileOpen((value) => !value)} aria-label="Profile menu">
            {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : <span>{user.name?.slice(0, 1)}</span>}
          </button>
          {profileOpen && (
            <div className="dropdown-panel">
              <div className="dropdown-user">
                {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} /> : <span>{user.name?.slice(0, 1)}</span>}
                <div><strong>{user.name}</strong><p>{user.email}</p></div>
              </div>
              <button type="button"><Icon name="settings" />Settings</button>
              <p>Settings are read-only for this assignment build. Profile edits live on the Profile page.</p>
              <button type="button"><Icon name="shield" />Privacy Policy</button>
              <p>HireBridge stores account, profile, job, application, and bookmark data only for role-based workflows.</p>
              <button className="danger" type="button" onClick={onLogout}><Icon name="logout" />Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
