import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import { ErrorState } from '../../components/States.jsx';

const BLANK = { name: '', email: '', password: '', role: 'sales' };

export default function AdminStaff() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/admin/staff').then((r) => setItems(r.items)).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      await api.post('/admin/staff', form);
      setForm(BLANK);
      setNotice('کارمند اضافه شد.');
      load();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy(false);
    }
  };

  const patch = async (s, body) => {
    try {
      await api.patch(`/admin/staff/${s.id}`, body);
      load();
    } catch (err) {
      setNotice(err.message);
    }
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="admin-page">
      <header className="page-head">
        <div>
          <h1>کارکنان</h1>
          <p className="muted">نقش‌ها و دسترسی کارکنان نمایشگاه.</p>
        </div>
      </header>

      <div className="two-col">
        <div className="panel">
          <h2>افزودن کارمند</h2>
          <form className="stack" onSubmit={add}>
            <div className="field">
              <label htmlFor="sf-name">نام</label>
              <input id="sf-name" className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="field">
              <label htmlFor="sf-email">ایمیل</label>
              <input id="sf-email" className="input" dir="ltr" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="field">
              <label htmlFor="sf-pass">گذرواژه (حداقل ۸ نویسه)</label>
              <input id="sf-pass" className="input" dir="ltr" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required minLength={8} />
            </div>
            <div className="field">
              <label htmlFor="sf-role">نقش</label>
              <select id="sf-role" className="input select" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
                <option value="sales">کارشناس فروش</option>
                <option value="admin">مدیر</option>
              </select>
            </div>
            {notice && <div className="form-message form-success" role="status">{notice}</div>}
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '…' : 'افزودن'}</button>
          </form>
        </div>

        <div className="panel">
          <h2>فهرست</h2>
          <ul className="admin-list">
            {items.map((s) => (
              <li key={s.id}>
                <div>
                  <strong>{s.name}</strong>
                  <div className="muted small" dir="ltr">{s.email}</div>
                </div>
                <div className="row-actions">
                  <select className="input select small-select" value={s.role} onChange={(e) => patch(s, { role: e.target.value })} aria-label="نقش">
                    <option value="sales">کارشناس</option>
                    <option value="admin">مدیر</option>
                  </select>
                  <button type="button" className="link-btn" onClick={() => patch(s, { isActive: !s.is_active })}>
                    {s.is_active ? 'غیرفعال' : 'فعال'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
