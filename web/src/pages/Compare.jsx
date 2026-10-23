import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useStore } from '../context/StoreContext.jsx';
import { EmptyState } from '../components/States.jsx';
import { PriceDisplay } from '../components/PriceDisplay.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { mileageLabel, yearLabel } from '../lib/format.js';

export default function Compare() {
  const { compare, toggleCompare, clearCompare } = useStore();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (compare.length === 0) {
      setVehicles([]);
      return;
    }
    setLoading(true);
    Promise.allSettled(compare.map((slug) => api.get(`/vehicles/${slug}`)))
      .then((results) => {
        setVehicles(results.filter((r) => r.status === 'fulfilled').map((r) => r.value.vehicle));
      })
      .finally(() => setLoading(false));
  }, [compare]);

  if (compare.length === 0) {
    return (
      <div className="container page">
        <h1>مقایسهٔ خودروها</h1>
        <EmptyState title="هنوز خودرویی برای مقایسه انتخاب نکرده‌اید" description="از کارت خودروها یا صفحهٔ جزئیات، حداکثر سه خودرو را به مقایسه اضافه کنید.">
          <Link to="/cars" className="btn btn-primary">مشاهدهٔ موجودی</Link>
        </EmptyState>
      </div>
    );
  }

  const rows = [
    ['قیمت', (v) => <PriceDisplay vehicle={v} />],
    ['وضعیت', (v) => <StatusBadge status={v.lifecycle} />],
    ['سال', (v) => yearLabel(v.year, v.yearCalendar)],
    ['کارکرد', (v) => mileageLabel(v.mileageKm)],
    ['بدنه', (v) => v.bodyType || 'ثبت نشده'],
    ['گیربکس', (v) => v.transmission || 'ثبت نشده'],
    ['سوخت', (v) => v.fuelType || 'ثبت نشده'],
    ['رنگ', (v) => v.exteriorColor || 'ثبت نشده'],
    ['شهر', (v) => v.city || 'ثبت نشده'],
    ['کارشناسی', (v) => (v.hasInspection ? 'دارد' : 'ثبت نشده')],
  ];

  return (
    <div className="container page">
      <div className="section-head">
        <h1>مقایسهٔ خودروها</h1>
        <button type="button" className="link-btn" onClick={clearCompare}>پاک کردن مقایسه</button>
      </div>
      {loading ? (
        <div className="skeleton skeleton-block" />
      ) : (
        <div className="table-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">مشخصه</th>
                {vehicles.map((v) => (
                  <th key={v.id} scope="col">
                    <Link to={`/cars/${v.slug}`}>{v.title}</Link>
                    <button type="button" className="link-btn small" onClick={() => toggleCompare(v.slug)}>حذف</button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {vehicles.map((v) => (
                    <td key={v.id}>{render(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {vehicles.length < 2 && <p className="muted">برای مقایسه، حداقل دو خودرو انتخاب کنید.</p>}
    </div>
  );
}
