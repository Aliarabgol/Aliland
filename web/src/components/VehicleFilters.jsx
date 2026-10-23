import { useEffect, useRef, useState } from 'react';

const TRANSMISSIONS = ['دنده‌ای', 'اتوماتیک'];
const BODY_TYPES = ['سدان', 'شاسی‌بلند', 'هاچ‌بک', 'کوپه', 'پیکاپ'];

export function VehicleFilters({ facets, params, update, clearAll }) {
  const [advanced, setAdvanced] = useState(false);
  const [q, setQ] = useState(params.q || '');
  const timer = useRef(null);

  useEffect(() => {
    setQ(params.q || '');
  }, [params.q]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onQ = (value) => {
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => update('q', value), 400);
  };

  const brandModels = params.brand ? facets.brands?.[params.brand] || [] : [];

  return (
    <aside className="filters" aria-label="فیلتر خودروها">
      <div className="filters-head">
        <h2>فیلترها</h2>
        <button type="button" className="link-btn" onClick={clearAll}>پاک کردن همه</button>
      </div>

      <div className="field">
        <label htmlFor="f-q">جست‌وجو</label>
        <input
          id="f-q"
          className="input"
          type="search"
          placeholder="برند، مدل یا توضیحات"
          value={q}
          onChange={(e) => onQ(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="f-brand">برند</label>
        <select
          id="f-brand"
          className="input select"
          value={params.brand || ''}
          onChange={(e) => update({ brand: e.target.value, model: '' })}
        >
          <option value="">همهٔ برندها</option>
          {Object.keys(facets.brands || {}).map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-model">مدل</label>
        <select
          id="f-model"
          className="input select"
          value={params.model || ''}
          disabled={!params.brand}
          onChange={(e) => update('model', e.target.value)}
        >
          <option value="">{params.brand ? 'همهٔ مدل‌ها' : 'ابتدا برند را انتخاب کنید'}</option>
          {brandModels.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-pmin">قیمت از (تومان)</label>
          <input id="f-pmin" className="input" inputMode="numeric" value={params.priceMin || ''} onChange={(e) => update('priceMin', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="f-pmax">تا (تومان)</label>
          <input id="f-pmax" className="input" inputMode="numeric" value={params.priceMax || ''} onChange={(e) => update('priceMax', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-cal">تقویم سال</label>
        <select id="f-cal" className="input select" value={params.yearCalendar || ''} onChange={(e) => update('yearCalendar', e.target.value)}>
          <option value="">هر دو تقویم</option>
          <option value="jalali">شمسی</option>
          <option value="gregorian">میلادی</option>
        </select>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="f-yfrom">سال از</label>
          <input id="f-yfrom" className="input" inputMode="numeric" value={params.yearFrom || ''} onChange={(e) => update('yearFrom', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="f-yto">تا</label>
          <input id="f-yto" className="input" inputMode="numeric" value={params.yearTo || ''} onChange={(e) => update('yearTo', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-mileage">حداکثر کارکرد (کیلومتر)</label>
        <input id="f-mileage" className="input" inputMode="numeric" value={params.mileageMax || ''} onChange={(e) => update('mileageMax', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="f-trans">گیربکس</label>
        <select id="f-trans" className="input select" value={params.transmission || ''} onChange={(e) => update('transmission', e.target.value)}>
          <option value="">همه</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-body">نوع بدنه</label>
        <select id="f-body" className="input select" value={params.bodyType || ''} onChange={(e) => update('bodyType', e.target.value)}>
          <option value="">همه</option>
          {BODY_TYPES.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="f-city">شهر</label>
        <select id="f-city" className="input select" value={params.city || ''} onChange={(e) => update('city', e.target.value)}>
          <option value="">همهٔ شهرها</option>
          {(facets.cities || []).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <button type="button" className="link-btn advanced-toggle" onClick={() => setAdvanced((v) => !v)} aria-expanded={advanced}>
        {advanced ? 'بستن فیلتر پیشرفته' : 'فیلتر پیشرفته'}
      </button>

      {advanced && (
        <>
          <div className="field">
            <label htmlFor="f-fuel">سوخت</label>
            <select id="f-fuel" className="input select" value={params.fuelType || ''} onChange={(e) => update('fuelType', e.target.value)}>
              <option value="">همه</option>
              {(facets.fuelTypes || []).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-color">رنگ</label>
            <select id="f-color" className="input select" value={params.color || ''} onChange={(e) => update('color', e.target.value)}>
              <option value="">همه</option>
              {(facets.colors || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </>
      )}
    </aside>
  );
}
