import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { navigate, pathForRole } from '../../routes/router';
import '../../styles/Register.css';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STUDENT', companyName: '', headline: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const user = await register(form);
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
            <span className="hb-eyebrow">Start strong</span>
            <h1>Register</h1>
            <p>Create a role-based account and land on the right dashboard automatically.</p>
          </div>

          <form className="hb-form-card" onSubmit={submit}>
            <label className="hb-field hb-col-2">
              <span className="hb-field-label">Full name</span>
              <div className="hb-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                <input
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </div>
            </label>

            <label className="hb-field">
              <span className="hb-field-label">I am a</span>
              <div className="hb-input-wrap select">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
                  <path d="M3 7l9-4 9 4-9 4-9-4z" />
                  <path d="M7 9.5V16c0 1 2 2.5 5 2.5s5-1.5 5-2.5V9.5" />
                </svg>
                <select
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value })}
                >
                  <option value="STUDENT">Student</option>
                  <option value="HIRING_MANAGER">Hiring Manager</option>
                </select>
              </div>
            </label>

            <label className="hb-field">
              <span className="hb-field-label">Headline</span>
              <div className="hb-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
                  <path d="M4 6h16" /><path d="M4 12h10" /><path d="M4 18h7" />
                </svg>
                <input
                  placeholder="e.g. CS student"
                  value={form.headline}
                  onChange={(event) => setForm({ ...form, headline: event.target.value })}
                />
              </div>
            </label>

            {form.role === 'HIRING_MANAGER' && (
              <label className="hb-field hb-col-2">
                <span className="hb-field-label">Company name</span>
                <div className="hb-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
                    <rect x="4" y="3" width="16" height="18" rx="1" />
                    <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
                  </svg>
                  <input
                    placeholder="Your company's name"
                    value={form.companyName}
                    onChange={(event) => setForm({ ...form, companyName: event.target.value })}
                  />
                </div>
              </label>
            )}

            <label className="hb-field">
              <span className="hb-field-label">Email</span>
              <div className="hb-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16201B" strokeWidth="2">
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

            <button className="hb-btn primary hb-col-2" disabled={loading}>
              {loading ? 'Please wait…' : 'Create account'}
            </button>

            {message && <p className="hb-form-error hb-col-2">{message}</p>}
          </form>
        </div>
      </section>
  );
}