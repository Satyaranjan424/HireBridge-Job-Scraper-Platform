import { navigate } from '../../routes/router';
import Pill from '../ui/Pill';
import Icon from '../ui/Icons';

export default function ShellNav({ user, active, nav, onLogout, open, onClose }) {
  return (
    <aside className={open ? 'open' : ''}>
      <div className="brand">HireBridge</div>
      <Pill tone="dark">{user.role === 'HIRING_MANAGER' ? 'Hiring Manager' : 'Student'}</Pill>
      <p>{user.role === 'HIRING_MANAGER' ? user.companyName || user.name : user.headline || 'Job seeker'}</p>
      <nav>
        {nav.map((item) => (
          <button
            key={item.path}
            className={active === item.key ? 'active' : ''}
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
          >
            <Icon name={item.icon} />{item.label}
          </button>
        ))}
      </nav>
      <button className="ghost" onClick={onLogout}>Logout</button>
    </aside>
  );
}
