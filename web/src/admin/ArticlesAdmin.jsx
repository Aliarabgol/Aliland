import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from '../components/Icons.jsx';

const BLANK = {
  title_fa: '',
  title_en: '',
  excerpt_fa: '',
  excerpt_en: '',
  body_fa: '',
  body_en: '',
  category: 'buying',
  cover_tone: '#415CF0',
  read_minutes: 4,
  status: 'draft',
};

export default function ArticlesAdmin() {
  const { t, num } = useI18n();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');

  const load = () =>
    api
      .get('/admin/articles')
      .then((data) => setItems(data.items || []))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (editing.id) await api.patch(`/admin/articles/${editing.id}`, editing);
      else await api.post('/admin/articles', editing);
      setEditing(null);
      setFlash(t('admin.saved'));
      await load();
      setTimeout(() => setFlash(''), 2400);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (article) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    await api.del(`/admin/articles/${article.id}`);
    await load();
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="admin-head">
        <div>
          <h1>{t('admin.articles')}</h1>
          <p className="small muted">{num(items.length)}</p>
        </div>
        <div className="row">
          {flash && <span className="tag tag--cobalt">{flash}</span>}
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setEditing({ ...BLANK })}>
            <Icon name="plus" size={14} />
            {t('act.create')}
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('journal.title')}</th>
              <th>{t('journal.all')}</th>
              <th>{t('admin.publish')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((article) => (
              <tr key={article.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>{article.title_fa}</div>
                  <div className="small muted">{article.title_en}</div>
                </td>
                <td className="small">{article.category}</td>
                <td>
                  <span className={`status-dot status-dot--${article.status === 'published' ? 'published' : 'draft'}`}>
                    {article.status === 'published' ? t('admin.publish') : t('admin.draft')}
                  </span>
                </td>
                <td>
                  <div className="row" style={{ gap: 4, flexWrap: 'nowrap' }}>
                    <button type="button" className="mini-btn" aria-label={t('act.edit')} onClick={() => setEditing({ ...article })}>
                      <Icon name="edit" size={14} />
                    </button>
                    <button type="button" className="mini-btn" aria-label={t('act.delete')} onClick={() => remove(article)}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)} role="dialog" aria-modal="true">
          <div className="modal" onClick={(event) => event.stopPropagation()} style={{ width: 'min(820px, 100%)' }}>
            <div className="flex-between">
              <h2 className="h3">{editing.id ? t('act.edit') : t('act.create')}</h2>
              <button type="button" className="icon-btn" onClick={() => setEditing(null)} aria-label={t('act.close')}>
                <Icon name="close" />
              </button>
            </div>

            <div className="form-grid form-grid--2">
              <div className="field">
                <label htmlFor="a-title-fa">عنوان فارسی</label>
                <input
                  id="a-title-fa"
                  className="input"
                  value={editing.title_fa || ''}
                  onChange={(event) => setEditing({ ...editing, title_fa: event.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="a-title-en">Title (English)</label>
                <input
                  id="a-title-en"
                  className="input"
                  dir="ltr"
                  value={editing.title_en || ''}
                  onChange={(event) => setEditing({ ...editing, title_en: event.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="a-cat">{t('journal.all')}</label>
                <select
                  id="a-cat"
                  className="select"
                  value={editing.category}
                  onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                >
                  {['buying', 'selling', 'comparison', 'technical', 'inspection', 'maintenance', 'domestic', 'imported', 'market', 'ev'].map(
                    (value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="field">
                <label htmlFor="a-status">{t('admin.publish')}</label>
                <select
                  id="a-status"
                  className="select"
                  value={editing.status}
                  onChange={(event) => setEditing({ ...editing, status: event.target.value })}
                >
                  <option value="published">{t('admin.publish')}</option>
                  <option value="draft">{t('admin.draft')}</option>
                </select>
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="a-excerpt-fa">خلاصه فارسی</label>
                <textarea
                  id="a-excerpt-fa"
                  className="textarea"
                  style={{ minHeight: 70 }}
                  value={editing.excerpt_fa || ''}
                  onChange={(event) => setEditing({ ...editing, excerpt_fa: event.target.value })}
                />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="a-body-fa">متن فارسی (پاراگراف‌ها با یک خط خالی؛ عنوان بخش با ##)</label>
                <textarea
                  id="a-body-fa"
                  className="textarea"
                  style={{ minHeight: 170 }}
                  value={editing.body_fa || ''}
                  onChange={(event) => setEditing({ ...editing, body_fa: event.target.value })}
                />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="a-excerpt-en">Excerpt (English)</label>
                <textarea
                  id="a-excerpt-en"
                  className="textarea"
                  style={{ minHeight: 70 }}
                  dir="ltr"
                  value={editing.excerpt_en || ''}
                  onChange={(event) => setEditing({ ...editing, excerpt_en: event.target.value })}
                />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="a-body-en">Body (English)</label>
                <textarea
                  id="a-body-en"
                  className="textarea"
                  style={{ minHeight: 170 }}
                  dir="ltr"
                  value={editing.body_en || ''}
                  onChange={(event) => setEditing({ ...editing, body_en: event.target.value })}
                />
              </div>
            </div>

            <div className="flow-nav">
              <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>
                {t('act.cancel')}
              </button>
              <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
                {saving ? t('act.loading') : t('act.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
