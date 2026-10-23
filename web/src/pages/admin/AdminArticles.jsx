import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import { ErrorState } from '../../components/States.jsx';
import { dateLabel } from '../../lib/format.js';

const BLANK = { id: null, slug: '', title: '', excerpt: '', body_md: '', isPublished: false };

export default function AdminArticles() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/admin/articles').then((r) => setItems(r.items)).catch((e) => setError(e.message));

  useEffect(() => {
    load();
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      if (form.id) {
        await api.put(`/admin/articles/${form.id}`, { title: form.title, excerpt: form.excerpt, body_md: form.body_md, isPublished: form.isPublished });
        setNotice('مقاله ذخیره شد.');
      } else {
        await api.post('/admin/articles', form);
        setNotice('مقاله ساخته شد.');
      }
      setForm(BLANK);
      load();
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy(false);
    }
  };

  const edit = (a) => setForm({ id: a.id, slug: a.slug, title: a.title, excerpt: a.excerpt || '', body_md: a.body_md || '', isPublished: a.is_published });

  const remove = async (a) => {
    if (!window.confirm(`حذف «${a.title}»؟`)) return;
    try {
      await api.del(`/admin/articles/${a.id}`);
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
          <h1>مقالات</h1>
          <p className="muted">مقاله‌های راهنمای خرید را مدیریت کنید.</p>
        </div>
      </header>

      <div className="two-col">
        <div className="panel">
          <h2>{form.id ? 'ویرایش مقاله' : 'مقالهٔ جدید'}</h2>
          <form className="stack" onSubmit={save}>
            {!form.id && (
              <div className="field">
                <label htmlFor="ar-slug">slug (لاتین)</label>
                <input id="ar-slug" className="input" dir="ltr" value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
              </div>
            )}
            <div className="field">
              <label htmlFor="ar-title">عنوان</label>
              <input id="ar-title" className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="ar-excerpt">خلاصه</label>
              <input id="ar-excerpt" className="input" value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="ar-body">متن مقاله</label>
              <textarea id="ar-body" className="input textarea" rows={8} value={form.body_md} onChange={(e) => set('body_md', e.target.value)} />
            </div>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} />
              <span>منتشر شود</span>
            </label>
            {notice && <div className="form-message form-success" role="status">{notice}</div>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '…' : 'ذخیره'}</button>
              {form.id && <button type="button" className="btn btn-ghost" onClick={() => setForm(BLANK)}>جدید</button>}
            </div>
          </form>
        </div>

        <div className="panel">
          <h2>فهرست</h2>
          <ul className="admin-list">
            {items.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.title}</strong>
                  <div className="muted small">{a.is_published ? 'منتشرشده' : 'پیش‌نویس'} · {dateLabel(a.published_at)}</div>
                </div>
                <div className="row-actions">
                  <button type="button" className="link-btn" onClick={() => edit(a)}>ویرایش</button>
                  <button type="button" className="link-btn danger" onClick={() => remove(a)}>حذف</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
