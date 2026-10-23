import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, qs } from '../../api.js';
import { ErrorState } from '../../components/States.jsx';
import { dateLabel, faNum, leadStatusLabels, leadTypeLabels } from '../../lib/format.js';

const TYPES = ['viewing', 'call', 'sell', 'request-car', 'contact'];
const STATUSES = ['new', 'contacted', 'scheduled', 'won', 'lost', 'closed'];

export default function AdminLeads() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ type: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get(`/admin/leads${qs(filters)}`)
      .then((r) => setItems(r.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters.type, filters.status]);

  return (
    <div className="admin-page">
      <header className="page-head">
        <div>
          <h1>درخواست‌ها</h1>
          <p className="muted">ثبت‌شده از فرم‌های عمومی. دادهٔ خصوصی فقط برای کارکنان مجاز است.</p>
        </div>
      </header>

      <div className="admin-filters">
        <select className="input select" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} aria-label="نوع">
          <option value="">همهٔ انواع</option>
          {TYPES.map((t) => <option key={t} value={t}>{leadTypeLabels[t]}</option>)}
        </select>
        <select className="input select" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} aria-label="وضعیت">
          <option value="">همهٔ وضعیت‌ها</option>
          {STATUSES.map((s) => <option key={s} value={s}>{leadStatusLabels[s]}</option>)}
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <div className="skeleton skeleton-block" />
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr><th>کد</th><th>نوع</th><th>نام</th><th>موبایل</th><th>وضعیت</th><th>تاریخ</th><th>واگذاری</th></tr>
            </thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id}>
                  <td dir="ltr"><Link to={`/admin/leads/${l.id}`}>{l.public_code}</Link></td>
                  <td>{leadTypeLabels[l.type] || l.type}</td>
                  <td>{l.name}</td>
                  <td dir="ltr">{l.phone}</td>
                  <td>{leadStatusLabels[l.status] || l.status}</td>
                  <td>{dateLabel(l.created_at)}</td>
                  <td>{l.assigned_to ? `#${faNum(l.assigned_to)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="muted">درخواستی با این فیلترها نیست.</p>}
        </div>
      )}
    </div>
  );
}
