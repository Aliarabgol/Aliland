import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, qs } from '../../api.js';
import { StatusBadge } from '../../components/StatusBadge.jsx';
import { ErrorState } from '../../components/States.jsx';
import { faNum, priceLabel, yearLabel } from '../../lib/format.js';

const PUB = ['draft', 'pending_review', 'published', 'archived'];
const LIFE = ['available', 'reserved', 'sold', 'withdrawn'];
const PUB_FA = { draft: 'پیش‌نویس', pending_review: 'در انتظار بازبینی', published: 'منتشرشده', archived: 'بایگانی' };
const LIFE_FA = { available: 'موجود', reserved: 'رزرو', sold: 'فروخته', withdrawn: 'خارج‌شده' };

export default function AdminVehicles() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ publication: '', lifecycle: '', q: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get(`/admin/vehicles${qs(filters)}`)
      .then((r) => setItems(r.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filters.publication, filters.lifecycle]);

  const setFilter = (k, v) => setFilters((f) => ({ ...f, [k]: v }));

  const togglePublish = async (v) => {
    const next = v.publication_status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/admin/vehicles/${v.id}/status`, { publication: next });
      setNotice(`«${v.title}» به ${PUB_FA[next]} تغییر کرد.`);
      load();
    } catch (err) {
      setNotice(err.message);
    }
  };

  const remove = async (v) => {
    if (!window.confirm(`حذف «${v.title}»؟ این کار قابل بازگشت نیست.`)) return;
    try {
      await api.del(`/admin/vehicles/${v.id}`);
      setNotice('خودرو حذف شد.');
      load();
    } catch (err) {
      setNotice(err.message);
    }
  };

  return (
    <div className="admin-page">
      <header className="page-head">
        <div>
          <h1>خودروها</h1>
          <p className="muted">مدیریت موجودی، وضعیت انتشار و انتشار سریع.</p>
        </div>
        <Link to="/admin/vehicles/new" className="btn btn-primary">افزودن خودرو</Link>
      </header>

      <div className="admin-filters">
        <select className="input select" value={filters.publication} onChange={(e) => setFilter('publication', e.target.value)} aria-label="وضعیت انتشار">
          <option value="">همهٔ وضعیت‌های انتشار</option>
          {PUB.map((p) => <option key={p} value={p}>{PUB_FA[p]}</option>)}
        </select>
        <select className="input select" value={filters.lifecycle} onChange={(e) => setFilter('lifecycle', e.target.value)} aria-label="وضعیت موجودی">
          <option value="">همهٔ وضعیت‌های موجودی</option>
          {LIFE.map((l) => <option key={l} value={l}>{LIFE_FA[l]}</option>)}
        </select>
        <form onSubmit={(e) => { e.preventDefault(); load(); }} className="inline-form">
          <input className="input" placeholder="جست‌وجو" value={filters.q} onChange={(e) => setFilter('q', e.target.value)} />
          <button type="submit" className="btn btn-ghost">جست‌وجو</button>
        </form>
      </div>

      {notice && <div className="form-message form-success" role="status">{notice}</div>}

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <div className="skeleton skeleton-block" />
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>عنوان</th><th>برند/مدل</th><th>سال</th><th>قیمت</th><th>موجودی</th><th>انتشار</th><th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id}>
                  <td>
                    <Link to={`/admin/vehicles/${v.id}`}>{v.title}</Link>
                    {v.is_demo && <span className="badge badge-demo">نمونه</span>}
                    <div className="muted small" dir="ltr">{v.public_code}</div>
                  </td>
                  <td>{v.brand} {v.model}</td>
                  <td>{yearLabel(v.year_value, v.year_calendar)}</td>
                  <td>{priceLabel({ price: v.price_toman, priceMode: v.price_mode })}</td>
                  <td><StatusBadge status={v.lifecycle_status} /></td>
                  <td><StatusBadge status={v.publication_status} label={PUB_FA[v.publication_status]} /></td>
                  <td className="row-actions">
                    <Link to={`/admin/vehicles/${v.id}`} className="link-btn">ویرایش</Link>
                    <button type="button" className="link-btn" onClick={() => togglePublish(v)}>
                      {v.publication_status === 'published' ? 'لغو انتشار' : 'انتشار'}
                    </button>
                    <button type="button" className="link-btn danger" onClick={() => remove(v)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="muted">خودرویی با این فیلترها نیست.</p>}
        </div>
      )}
      <p className="muted small">تعداد کل: {faNum(items.length)} رکورد</p>
    </div>
  );
}
