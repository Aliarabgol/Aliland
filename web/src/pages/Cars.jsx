import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, qs } from '../api.js';
import { VehicleFilters } from '../components/VehicleFilters.jsx';
import { VehicleCard } from '../components/VehicleCard.jsx';
import { EmptyState, ErrorState, SkeletonCard } from '../components/States.jsx';
import { faNum } from '../lib/format.js';

const EMPTY_FACETS = { brands: {}, cities: [], bodyTypes: [], fuelTypes: [], transmissions: [], colors: [] };

const SORTS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'price_asc', label: 'ارزان‌ترین' },
  { value: 'price_desc', label: 'گران‌ترین' },
  { value: 'mileage_asc', label: 'کم‌کارکردترین' },
  { value: 'year_desc', label: 'جدیدترین سال' },
];

function chipsOf(params) {
  const chips = [];
  const add = (key, label) => chips.push({ key, label });
  if (params.q) add('q', `جست‌وجو: ${params.q}`);
  if (params.brand) add('brand', params.brand);
  if (params.model) add('model', params.model);
  if (params.city) add('city', params.city);
  if (params.bodyType) add('bodyType', params.bodyType);
  if (params.transmission) add('transmission', params.transmission);
  if (params.fuelType) add('fuelType', params.fuelType);
  if (params.color) add('color', params.color);
  if (params.priceMin) add('priceMin', `قیمت از ${faNum(params.priceMin)} تومان`);
  if (params.priceMax) add('priceMax', `قیمت تا ${faNum(params.priceMax)} تومان`);
  if (params.yearCalendar) add('yearCalendar', params.yearCalendar === 'jalali' ? 'تقویم شمسی' : 'تقویم میلادی');
  if (params.yearFrom) add('yearFrom', `سال از ${faNum(params.yearFrom)}`);
  if (params.yearTo) add('yearTo', `سال تا ${faNum(params.yearTo)}`);
  if (params.mileageMax) add('mileageMax', `کارکرد تا ${faNum(params.mileageMax)} کیلومتر`);
  return chips;
}

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);
  const [facets, setFacets] = useState(EMPTY_FACETS);
  const [data, setData] = useState({ items: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reqId = useRef(0);

  useEffect(() => {
    api.get('/vehicles/facets').then(setFacets).catch(() => setFacets(EMPTY_FACETS));
  }, []);

  const load = () => {
    const id = ++reqId.current;
    setLoading(true);
    setError('');
    api
      .get(`/vehicles${qs({ ...params, pageSize: 12 })}`)
      .then((res) => {
        if (id !== reqId.current) return;
        setData(res);
      })
      .catch((err) => {
        if (id !== reqId.current) return;
        setError(err.message);
      })
      .finally(() => id === reqId.current && setLoading(false));
  };

  useEffect(load, [searchParams]);

  // Accepts update('brand', 'x') or update({ brand: 'x', model: '' }) so a dependent
  // field can be cleared in the same navigation (two separate calls would drop the first).
  const update = (key, value) => {
    const patch = typeof key === 'object' && key !== null ? key : { [key]: value };
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    if (!('page' in patch)) next.delete('page');
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams(new URLSearchParams());
  const chips = chipsOf(params);
  const page = Number(params.page || 1);

  return (
    <div className="container page">
      <header className="page-head">
        <div>
          <h1>خودروهای موجود</h1>
          <p className="muted">همهٔ خودروهای منتشرشده را بر اساس بودجه، برند و مشخصات فیلتر کنید.</p>
        </div>
        <div className="page-head-actions">
          <label className="sr-only" htmlFor="f-sort">مرتب‌سازی</label>
          <select id="f-sort" className="input select sort-select" value={params.sort || 'newest'} onChange={(e) => update('sort', e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </header>

      <div className="inventory-layout">
        <VehicleFilters facets={facets} params={params} update={update} clearAll={clearAll} />

        <section className="inventory-main" aria-live="polite">
          <div className="results-bar">
            <span>{loading ? 'در حال دریافت…' : `${faNum(data.total)} خودرو`}</span>
            {chips.length > 0 && (
              <div className="chips">
                {chips.map((c) => (
                  <button key={c.key} type="button" className="chip" onClick={() => update(c.key, '')}>
                    {c.label} <span aria-hidden="true">×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {error ? (
            <ErrorState message={error} onRetry={load} />
          ) : loading ? (
            <div className="vehicle-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <EmptyState title="خودرویی با این فیلترها پیدا نشد" description="فیلترها را پاک کنید یا درخواست خودرو ثبت کنید تا در صورت موجود شدن اطلاع دهیم.">
              <button type="button" className="btn btn-primary" onClick={clearAll}>پاک کردن فیلترها</button>
              <Link to="/request-car" className="btn btn-ghost">ثبت درخواست خودرو</Link>
            </EmptyState>
          ) : (
            <>
              <div className="vehicle-grid">
                {data.items.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
              {data.totalPages > 1 && (
                <nav className="pagination" aria-label="صفحه‌بندی">
                  <button type="button" className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => update('page', page - 1)}>
                    قبلی
                  </button>
                  <span>صفحهٔ {faNum(page)} از {faNum(data.totalPages)}</span>
                  <button type="button" className="btn btn-ghost btn-sm" disabled={page >= data.totalPages} onClick={() => update('page', page + 1)}>
                    بعدی
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
