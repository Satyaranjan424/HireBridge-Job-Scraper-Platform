import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { navigate, pathForRole } from '../../routes/router';

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
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

          .hb-auth {
            --paper: #EAF0EC;
            --ink: #12181F;
            --ink-soft: #1B232C;
            --ink-line: #2C3742;
            --gold: #E8A33D;
            --gold-deep: #C97F1E;
            --mint: #2F6E4F;
            --mint-deep: #234F39;
            --text-dark: #16201B;
            --muted-dark: #5A6960;
            --border: #D9E2DB;
            --danger: #C4432E;
            --danger-bg: #FBEAE6;
            font-family: 'Inter', sans-serif;
            width: 100%;
            max-width: 460px;
            margin: 0 auto;
            height: 100dvh;
            max-height: 100dvh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 12px 16px;
          }
          .hb-auth * { box-sizing: border-box; }

          .hb-auth-mark {
            display: flex; align-items: center; gap: 8px;
            font-weight: 800; font-size: 18px; color: var(--text-dark);
            margin-bottom: clamp(10px, 2.4vh, 22px);
            flex-shrink: 0; background: none; border: none; cursor: pointer;
          }
          .hb-auth-mark .hb-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }

          .hb-auth-card {
            width: 100%;
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: clamp(18px, 3.2vh, 32px) clamp(20px, 4vw, 32px);
            box-shadow: 0 20px 44px rgba(18, 24, 31, 0.08);
            flex-shrink: 0;
            max-height: 100%;
            overflow-y: auto;
          }
          .hb-auth-head { margin-bottom: clamp(12px, 2.4vh, 22px); }
          .hb-eyebrow {
            display: block; font-size: 12.5px; font-weight: 700; letter-spacing: 0.06em;
            text-transform: uppercase; color: var(--mint-deep); margin-bottom: 8px;
          }
          .hb-auth-head h1 {
            font-size: clamp(22px, 3vh, 26px); font-weight: 700; letter-spacing: -0.01em; color: var(--text-dark); margin: 0 0 6px;
          }
          .hb-auth-head p { margin: 0; font-size: 14px; color: var(--muted-dark); line-height: 1.5; }

          .hb-form-card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: clamp(8px, 1.6vh, 14px) 12px;
          }
          .hb-col-2 { grid-column: 1 / -1; }

          .hb-field { display: flex; flex-direction: column; gap: 5px; }
          .hb-field-label { font-size: 12.5px; font-weight: 600; color: var(--text-dark); }
          .hb-input-wrap { position: relative; display: flex; align-items: center; }
          .hb-input-wrap svg {
            position: absolute; left: 12px; pointer-events: none; opacity: 0.55;
          }
          .hb-input-wrap input, .hb-input-wrap select {
            width: 100%; font-family: 'Inter', sans-serif; font-size: 14.5px; color: var(--text-dark);
            background: #F7F9F7; border: 1px solid var(--border); border-radius: 9px;
            padding: 11px 12px 11px 38px;
            transition: border-color .15s, box-shadow .15s, background .15s;
          }
          .hb-input-wrap select { padding-left: 38px; appearance: none; cursor: pointer; }
          .hb-input-wrap.select::after {
            content: ''; position: absolute; right: 13px; width: 8px; height: 8px;
            border-right: 1.5px solid var(--muted-dark); border-bottom: 1.5px solid var(--muted-dark);
            transform: rotate(45deg); pointer-events: none;
          }
          .hb-input-wrap input::placeholder { color: #9AA79F; }
          .hb-input-wrap input:focus, .hb-input-wrap select:focus {
            outline: none; background: #fff; border-color: var(--mint);
            box-shadow: 0 0 0 3px rgba(47, 110, 79, 0.14);
          }

          .hb-btn {
            width: 100%; padding: 12px 18px; border-radius: 9px; font-size: 15px; font-weight: 600;
            border: 1px solid var(--ink-line); background: transparent; color: var(--text-dark);
            cursor: pointer; transition: transform .15s, background .2s, opacity .2s;
          }
          .hb-btn:hover { transform: translateY(-1px); }
          .hb-btn:active { transform: translateY(0); }
          .hb-btn.primary {
            background: var(--ink); border-color: var(--ink); color: #fff; margin-top: 2px;
          }
          .hb-btn.primary:hover { background: var(--ink-soft); }
          .hb-btn.primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
          .hb-btn:focus-visible { outline: 2px solid var(--gold-deep); outline-offset: 2px; }

          .hb-form-error {
            display: flex; align-items: center; gap: 8px;
            background: var(--danger-bg); color: var(--danger);
            border: 1px solid #F3CBC1; border-radius: 8px;
            padding: 9px 12px; font-size: 13px; font-weight: 500; margin: 0;
          }

          @media (max-width: 480px) {
            .hb-form-card { grid-template-columns: 1fr; }
            .hb-auth-card { padding: 20px 18px; border-radius: 14px; }
          }
        `}</style>

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