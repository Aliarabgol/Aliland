import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api } from '../../api.js';
import { faNum, leadTypeLabels } from '../../lib/format.js';
import { ErrorState } from '../../components/States.jsx';

export default function AdminDashboard() {
  const { user } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(setStats).catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!stats) return <div className="skeleton skeleton-block" />;

  const cards = [
    { label: 'موجود', value: stats.vehicles.available },
    { label: 'رزرو شده', value: stats.vehicles.reserved },
    { label: 'فروخته شده', value: stats.vehicles.sold },
    { label: 'خارج شده', value: stats.vehicles.withdrawn },
    { label: 'درخواست جدید', value: stats.leads.new, accent: true },
    { label: 'کل درخواست‌ها', value: stats.leads.total },
    { label: 'مقالات', value: stats.articles },
    { label: 'کارکنان فعال', value: stats.staff },
  ];

  return (
    <div className="admin-page">
      <header className="page-head">
        <div>
          <h1>داشبورد</h1>
          <p className="muted">خوش آمدید {user.name}؛ وضعیت کلی نمایشگاه.</p>
        </div>
      </header>

      <div className="stat-grid">
        {cards.map((c) => (
          <div key={c.label} className={`stat-card ${c.accent ? 'stat-accent' : ''}`}>
            <span className="stat-value">{faNum(c.value)}</span>
            <span className="stat-label">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="admin-quick">
        <Link to="/admin/vehicles/new" className="btn btn-primary">افزودن خودرو</Link>
        <Link to="/admin/leads" className="btn btn-ghost">مشاهدهٔ درخواست‌ها</Link>
        <Link to="/admin/vehicles" className="btn btn-ghost">مدیریت موجودی</Link>
      </div>

      <div className="panel">
        <h2>درخواست‌ها بر اساس نوع</h2>
        {Object.keys(stats.leads.byType).length === 0 ? (
          <p className="muted">هنوز درخواستی ثبت نشده است.</p>
        ) : (
          <ul className="plain-list">
            {Object.entries(stats.leads.byType).map(([type, n]) => (
              <li key={type}>{leadTypeLabels[type] || type}: {faNum(n)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
