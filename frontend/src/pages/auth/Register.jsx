import { useState } from 'react';
import AuthLayout from '../../layouts/AuthLayout';
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
    <AuthLayout>
      <section className="auth-panel">
        <div>
          <span className="eyebrow">Start strong</span>
          <h1>Register</h1>
          <p>Create a role-based account and land on the right dashboard automatically.</p>
        </div>
        <form className="form-card" onSubmit={submit}>
          <input placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="STUDENT">Student</option>
            <option value="HIRING_MANAGER">Hiring Manager</option>
          </select>
          {form.role === 'HIRING_MANAGER' && <input placeholder="Company name" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />}
          <input placeholder="Headline" value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          <button className="primary" disabled={loading}>{loading ? 'Please wait' : 'Create account'}</button>
          {message && <p className="form-error">{message}</p>}
        </form>
      </section>
    </AuthLayout>
  );
}
