import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from '../components/Icons.jsx';

export default function MediaAdmin() {
  const { t, num, lang } = useI18n();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', attribution: '' });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const load = () =>
    api
      .get('/admin/media')
      .then((data) => setItems(data.items || []))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const upload = async (event) => {
    event.preventDefault();
    setError('');
    if (!file) {
      setError(t('admin.uploadHint'));
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('name', form.name || file.name);
      body.append('description', form.description);
      body.append('attribution', form.attribution);
      await api.upload('/admin/media', body);
      setForm({ name: '', description: '', attribution: '' });
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      await load();
    } catch (err) {
      setError(err.payload?.error || err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (asset) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    await api.del(`/admin/media/${asset.id}`);
    await load();
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="admin-head">
        <div>
          <h1>{t('admin.media')}</h1>
          <p className="small muted">{num(items.length)}</p>
        </div>
      </div>

      <form className="card" onSubmit={upload} style={{ display: 'grid', gap: 12 }}>
        <div className="form-grid form-grid--2">
          <div className="field">
            <label htmlFor="m-file">{t('admin.upload')}</label>
            <input
              id="m-file"
              ref={inputRef}
              className="input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => {
                const selected = event.target.files?.[0] || null;
                setFile(selected);
                if (selected && !form.name) setForm({ ...form, name: selected.name });
              }}
            />
            <span className="hint">{t('admin.uploadHint')}</span>
          </div>
          <div className="field">
            <label htmlFor="m-name">name</label>
            <input
              id="m-name"
              className="input"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="m-desc">description</label>
            <input
              id="m-desc"
              className="input"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="m-attr">attribution</label>
            <input
              id="m-attr"
              className="input"
              value={form.attribution}
              onChange={(event) => setForm({ ...form, attribution: event.target.value })}
            />
          </div>
        </div>
        {error && <span className="field-error">{error}</span>}
        <div className="row">
          <button className="btn btn--primary btn--sm" type="submit" disabled={busy}>
            <Icon name="upload" size={14} />
            {busy ? t('act.loading') : t('admin.upload')}
          </button>
          <span className="small muted">
            {lang === 'fa'
              ? 'فقط تصاویر با نوع مجاز و حداکثر ۵ مگابایت پذیرفته می‌شوند. حقوق تصویر بر عهده بارگذار است.'
              : 'Only allow-listed image types up to 5 MB are accepted. The uploader is responsible for the rights.'}
          </span>
        </div>
      </form>

      <div className="stat-grid">
        {items.map((asset) => (
          <div className="card" key={asset.id} style={{ padding: 14, display: 'grid', gap: 8 }}>
            <div style={{ aspectRatio: '16/10', borderRadius: 10, overflow: 'hidden', background: '#0c0f16', display: 'grid', placeItems: 'center' }}>
              {asset.url?.startsWith('/uploads/') ? (
                <img src={asset.url} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Icon name={asset.kind === 'generated' ? 'layers' : 'image'} size={22} style={{ color: 'rgba(255,255,255,0.5)' }} />
              )}
            </div>
            <strong className="small">{asset.name}</strong>
            <span className="small muted" style={{ lineHeight: 1.6 }}>{asset.description}</span>
            <span className="micro muted">{asset.kind} · {asset.attribution?.slice(0, 70)}</span>
            <div className="row">
              <button type="button" className="mini-btn" onClick={() => remove(asset)} aria-label={t('act.delete')}>
                <Icon name="trash" size={14} />
              </button>
              <span className="micro muted" dir="ltr">{asset.url}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
