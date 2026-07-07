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
      <section className="auth-panel">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1>Login</h1>
          <p>Continue to your student or hiring manager dashboard.</p>
        </div>
        <form className="form-card" onSubmit={submit}>
          <input placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <button className="primary" disabled={loading}>{loading ? 'Please wait' : 'Login'}</button>
          <button type="button" onClick={() => navigate('/register')}>Create account</button>
          {message && <p className="form-error">{message}</p>}
        </form>
      </section>
    </AuthLayout>
  );
}
