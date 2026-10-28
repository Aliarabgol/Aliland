import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Dashboard() {
  const { t, lang, num } = useI18n();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/overview')
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="admin-note">
        <Icon name="alert" size={16} />
        <span>{error}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="stat-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton" key={index} style={{ height: 84 }} />
        ))}
      </div>
    );
  }

  const stats = [
    { label: t('admin.vehicles'), value: data.vehicles.total, hint: `${num(data.vehicles.published)} ${t('admin.publish')}` },
    { label: t('admin.draft'), value: data.vehicles.drafts },
    { label: t('admin.featured'), value: data.vehicles.featured },
    { label: t('admin.articles'), value: data.articles.total, hint: `${num(data.articles.published)} ${t('admin.publish')}` },
    { label: t('admin.media'), value: data.media.total },
    { label: t('admin.services'), value: data.services.total },
    { label: t('admin.applications'), value: data.applications.total },
    { label: t('admin.content'), value: data.sections.total },
  ];

  return (
    <div className="stack" style={{ gap: 22 }}>
      <div className="admin-head">
        <div>
          <h1>{t('admin.overview')}</h1>
          <p className="small muted">
            {t('shell.demo')} — {t('admin.syntheticOnly')}
          </p>
        </div>
        <Link className="btn btn--ink btn--sm" to="/">
          {t('nav.home')}
          <Icon name="external" size={14} />
        </Link>
      </div>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <span className="stat__value">{num(stat.value)}</span>
            <span className="stat__label">{stat.label}</span>
            {stat.hint && <span className="small muted">{stat.hint}</span>}
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="card">
          <h2 className="h3">{lang === 'fa' ? 'توزیع دسته‌بندی' : 'Category split'}</h2>
          <div className="stack mt-2" style={{ gap: 12 }}>
            {(data.byCategory || []).map((row) => {
              const total = data.vehicles.total || 1;
              return (
                <div key={row.category}>
                  <div className="flex-between small">
                    <span>{t(`cat.${row.category}`)}</span>
                    <span className="num">{num(row.count)}</span>
                  </div>
                  <div className="progress-bar" style={{ marginBlockStart: 6 }}>
                    <i style={{ width: `${(row.count / total) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="h3">{t('admin.activity')}</h2>
          <div className="stack mt-2" style={{ gap: 0 }}>
            {(data.activity || []).map((item) => (
              <div
                key={item.id}
                style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingBlock: 9, borderBlockEnd: '1px solid var(--hairline)' }}
              >
                <span className="small">
                  <strong>{item.action}</strong> — {item.entity} {item.detail ? `(${item.detail})` : ''}
                </span>
                <span className="small muted">
                  {new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }).format(new Date(item.created_at))}
                </span>
              </div>
            ))}
            {!data.activity?.length && <p className="small muted">{t('act.loading')}</p>}
          </div>
        </div>
      </div>

      <div className="admin-note">
        <Icon name="info" size={16} />
        <span>
          {lang === 'fa'
            ? 'پنل مدیریت با نشست محافظت‌شده و بررسی مجوز در سرور کار می‌کند. تمام تغییرات در پایگاه داده PostgreSQL ذخیره می‌شوند و بلافاصله در سایت عمومی دیده می‌شوند.'
            : 'The admin panel works with a protected session and server-side authorisation. Every change is stored in PostgreSQL and appears on the public site immediately.'}
        </span>
      </div>
    </div>
  );
}
