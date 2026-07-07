import { navigate } from '../routes/router';

export default function AuthLayout({ children }) {
  return (
    <main className="auth-page">
      <header className="public-header">
        <button className="brand-link" onClick={() => navigate('/')}>HireBridge</button>
        <nav>
          <button onClick={() => navigate('/')}>Home</button>
        </nav>
      </header>
      {children}
      <footer className="public-footer">HireBridge connects students and hiring teams with role-based workflows.</footer>
    </main>
  );
}
