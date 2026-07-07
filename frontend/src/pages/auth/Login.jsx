import { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { navigate, pathForRole } from '../../routes/router';

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
    <AuthLayout>
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
            max-width: 400px;
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
            margin-bottom: clamp(14px, 3vh, 28px);
            flex-shrink: 0;
          }
          .hb-auth-mark .hb-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gold); }

          .hb-auth-card {
            width: 100%;
            background: #fff;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: clamp(20px, 4vh, 36px) clamp(20px, 4vw, 32px);
            box-shadow: 0 20px 44px rgba(18, 24, 31, 0.08);
            flex-shrink: 0;
            max-height: 100%;
            overflow-y: auto;
          }
          .hb-auth-head { margin-bottom: clamp(14px, 3vh, 26px); }
          .hb-eyebrow {
            display: block; font-size: 12.5px; font-weight: 700; letter-spacing: 0.06em;
            text-transform: uppercase; color: var(--mint-deep); margin-bottom: 8px;
          }
          .hb-auth-head h1 {
            font-size: 26px; font-weight: 700; letter-spacing: -0.01em; color: var(--text-dark); margin: 0 0 6px;
          }
          .hb-auth-head p { margin: 0; font-size: 14.5px; color: var(--muted-dark); line-height: 1.5; }

          .hb-form-card { display: flex; flex-direction: column; gap: clamp(10px, 2vh, 16px); }

          .hb-field { display: flex; flex-direction: column; gap: 6px; }
          .hb-field-label { font-size: 13px; font-weight: 600; color: var(--text-dark); }
          .hb-input-wrap {
            position: relative; display: flex; align-items: center;
          }
          .hb-input-wrap svg {
            position: absolute; left: 13px; pointer-events: none; opacity: 0.55;
          }
          .hb-input-wrap input {
            width: 100%; font-family: 'Inter', sans-serif; font-size: 15px; color: var(--text-dark);
            background: #F7F9F7; border: 1px solid var(--border); border-radius: 9px;
            padding: 12px 14px 12px 40px;
            transition: border-color .15s, box-shadow .15s, background .15s;
          }
          .hb-input-wrap input::placeholder { color: #9AA79F; }
          .hb-input-wrap input:focus {
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
            background: var(--ink); border-color: var(--ink); color: #fff; margin-top: 4px;
          }
          .hb-btn.primary:hover { background: var(--ink-soft); }
          .hb-btn.primary:disabled {
            opacity: 0.6; cursor: not-allowed; transform: none;
          }
          .hb-btn.ghost { background: transparent; border-color: var(--border); color: var(--text-dark); }
          .hb-btn.ghost:hover { background: #F7F9F7; }
          .hb-btn:focus-visible { outline: 2px solid var(--gold-deep); outline-offset: 2px; }

          .hb-divider {
            display: flex; align-items: center; gap: 12px; margin: 4px 0;
            color: var(--muted-dark); font-size: 12.5px;
          }
          .hb-divider::before, .hb-divider::after {
            content: ''; flex: 1; height: 1px; background: var(--border);
          }

          .hb-form-error {
            display: flex; align-items: center; gap: 8px;
            background: var(--danger-bg); color: var(--danger);
            border: 1px solid #F3CBC1; border-radius: 8px;
            padding: 10px 12px; font-size: 13.5px; font-weight: 500; margin: 0;
          }

          @media (max-width: 480px) {
            .hb-auth-card { padding: 28px 22px; border-radius: 14px; }
          }
        `}</style>

        <button type="button" className="hb-auth-mark" onClick={() => navigate('/')}>
          <span className="hb-dot" />HireBridge
        </button>

        <div className="hb-auth-card">
          <div className="hb-auth-head">
            <span className="hb-eyebrow">Welcome back</span>
            <h1>Login</h1>
            <p>Continue to your student or hiring manager dashboard.</p>
          </div>

          <form className="hb-form-card" onSubmit={submit}>
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

            <button type="button" className="hb-btn ghost" onClick={() => navigate('/register')}>
              Create account
            </button>
          </form>
        </div>
      </section>
    </AuthLayout>
  );
}