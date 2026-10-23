import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/login', form);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="panel auth-card">
        <h1>ورود کارکنان</h1>
        <p className="muted">این بخش مخصوص مدیر و کارشناسان فروش نمایشگاه است.</p>
        <form className="stack" onSubmit={submit}>
          <div className="field">
            <label htmlFor="a-email">ایمیل</label>
            <input id="a-email" className="input" type="email" dir="ltr" autoComplete="username" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="field">
            <label htmlFor="a-pass">گذرواژه</label>
            <input id="a-pass" className="input" type="password" dir="ltr" autoComplete="current-password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
          </div>
          {error && <div className="form-message form-error" role="alert">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'در حال ورود…' : 'ورود'}</button>
        </form>
        <p className="muted small"><Link to="/">بازگشت به سایت</Link></p>
      </div>
    </div>
  );
}
