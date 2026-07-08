import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { navigate, pathForRole } from '../../routes/router';
import '../../styles/Login.css';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const user = await login(form);
      navigate(pathForRole(user.role));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
      <section className="hb-auth">
        <button type="button" className="hb-auth-mark" onClick={() => navigate('/')}>
          <span className="hb-dot" />HireBridge
        </button>

        <div className="hb-auth-card">
          <div className="hb-auth-head">
            <span className="hb-eyebrow">Welcome back</span>
            <h1>Login</h1>
            <p>Continue to your student or hiring manager dashboard.</p>
          </div>

          <form className="hb-form-cards" onSubmit={submit}>
            <label className="hb-field">
              <span className="hb-field-label">Email</span>
              <div className="hb-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </div>
            </label>

            <label className="hb-field">
              <span className="hb-field-label">Password</span>
              <div className="hb-input-wrap">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
                  <rect x="4" y="11" width="16" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
              </div>
            </label>

            <button className="hb-btn primary" disabled={loading}>
              {loading ? 'Please wait…' : 'Login'}
            </button>

            {message && <p className="hb-form-error">{message}</p>}

            <div className="hb-divider"><span>New to HireBridge?</span></div>

            <button type="button" className="hb-btns ghost" onClick={() => navigate('/register')}>
              Create account
            </button>
          </form>
        </div>
      </section>
  );
}