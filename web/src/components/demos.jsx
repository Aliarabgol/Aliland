import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from './Icons.jsx';

/* ————————————————————— instalments (concept) ————————————————————— */

const SPREAD = 0.08; // illustrative only — not an interest rate or an offer

export function InstalmentDemo() {
  const { t, num, money } = useI18n();
  const [price, setPrice] = useState(1450000000);
  const [downPct, setDownPct] = useState(30);
  const [term, setTerm] = useState(36);

  const out = useMemo(() => {
    const down = Math.round((price * downPct) / 100);
    const principal = price - down;
    const total = Math.round(principal * (1 + (SPREAD * term) / 12));
    return { down, monthly: Math.round(total / term), total, extra: total - price };
  }, [price, downPct, term]);

  return (
    <div className="flow-card">
      <div className="range-wrap">
        <div className="calc-range-label">
          <span>{t('v.price')}</span>
          <span className="num">{money(price)}</span>
        </div>
        <input
          type="range"
          min={500000000}
          max={8000000000}
          step={50000000}
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          aria-label={t('v.price')}
        />
      </div>
      <div className="range-wrap">
        <div className="calc-range-label">
          <span>{t('installment.down')}</span>
          <span className="num">{num(downPct)}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={70}
          step={5}
          value={downPct}
          onChange={(event) => setDownPct(Number(event.target.value))}
          aria-label={t('installment.down')}
        />
      </div>
      <div className="row" style={{ gap: 6 }}>
        {[12, 24, 36, 48, 60].map((value) => (
          <button
            type="button"
            className="chip"
            key={value}
            aria-pressed={term === value}
            onClick={() => setTerm(value)}
          >
            {num(value)} {t('installment.term')}
          </button>
        ))}
      </div>
      <div className="calc-out" style={{ borderColor: 'var(--hairline)' }}>
        {[
          [t('installment.down'), money(out.down)],
          [t('installment.monthly'), money(out.monthly)],
          [t('installment.total'), money(out.total)],
          [t('installment.extra'), money(out.extra)],
        ].map(([label, value]) => (
          <div className="calc-out__cell" key={label}>
            <span style={{ color: 'var(--on-surface-dim)' }}>{label}</span>
            <strong className="num">{value}</strong>
          </div>
        ))}
      </div>
      <p className="small muted">{t('installment.note')}</p>
    </div>
  );
}

/* ————————————————————— trade-in ————————————————————— */

export function TradeInDemo() {
  const { t, lang, money } = useI18n();
  const [vehicles, setVehicles] = useState([]);
  const [mine, setMine] = useState('');
  const [target, setTarget] = useState('');

  useEffect(() => {
    api
      .get('/vehicles?perPage=48&sort=price_asc')
      .then((data) => {
        const items = data.items || [];
        setVehicles(items);
        setMine(items[0]?.slug || '');
        setTarget(items[Math.min(3, items.length - 1)]?.slug || '');
      })
      .catch(() => {});
  }, []);

  const label = (vehicle) =>
    lang === 'fa' ? `${vehicle.make_fa} ${vehicle.model_fa}` : `${vehicle.make_en} ${vehicle.model_en}`;
  const mineVehicle = vehicles.find((vehicle) => vehicle.slug === mine);
  const targetVehicle = vehicles.find((vehicle) => vehicle.slug === target);
  const gap =
    mineVehicle && targetVehicle ? Number(targetVehicle.price_demo) - Number(mineVehicle.price_demo) : 0;

  return (
    <div className="flow-card">
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="ti-mine">{t('trade.yourCar')}</label>
          <select id="ti-mine" className="select" value={mine} onChange={(event) => setMine(event.target.value)}>
            {vehicles.map((vehicle) => (
              <option value={vehicle.slug} key={vehicle.slug}>
                {label(vehicle)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ti-target">{t('trade.targetCar')}</label>
          <select
            id="ti-target"
            className="select"
            value={target}
            onChange={(event) => setTarget(event.target.value)}
          >
            {vehicles.map((vehicle) => (
              <option value={vehicle.slug} key={vehicle.slug}>
                {label(vehicle)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="calc-out" style={{ borderColor: 'var(--hairline)' }}>
        <div className="calc-out__cell">
          <span style={{ color: 'var(--on-surface-dim)' }}>{t('trade.yourCar')}</span>
          <strong className="num">{money(mineVehicle?.price_demo)}</strong>
        </div>
        <div className="calc-out__cell">
          <span style={{ color: 'var(--on-surface-dim)' }}>{t('trade.targetCar')}</span>
          <strong className="num">{money(targetVehicle?.price_demo)}</strong>
        </div>
        <div className="calc-out__cell">
          <span style={{ color: 'var(--on-surface-dim)' }}>{t('trade.gap')}</span>
          <strong className="num" style={{ color: 'var(--cobalt)' }}>
            {gap > 0 ? `+ ${money(gap)}` : money(Math.abs(gap))}
          </strong>
        </div>
      </div>
      <p className="small muted">{t('trade.note')}</p>
    </div>
  );
}

/* ————————————————————— inspection checklist ————————————————————— */

const CHECKS = {
  body: [
    ['ضخامت رنگ هر پنل', 'Paint depth on each panel'],
    ['فاصله درزهای در و گلگیر', 'Door and wing panel gaps'],
    ['نشانه تعویض پیچ گلگیر', 'Signs of replaced wing bolts'],
    ['وضعیت آستانه درها', 'Condition of the door sills'],
    ['وضعیت کف صندوق', 'Condition of the boot floor'],
  ],
  mechanical: [
    ['نشتی روغن و خنک‌کننده', 'Oil and coolant leaks'],
    ['صداهای غیرعادی موتور', 'Unusual engine noises'],
    ['وضعیت کمک‌فنر و بوش', 'Shock absorbers and bushings'],
    ['ضخامت لنت ترمز', 'Brake pad thickness'],
    ['تاریخ تولید لاستیک‌ها', 'Tyre production dates'],
  ],
  cabin: [
    ['کارکرد کولر و بخاری', 'Climate control works'],
    ['شیشه‌بالابرها و آینه‌ها', 'Windows and mirrors'],
    ['نمایشگر و دوربین', 'Screen and camera'],
    ['وضعیت صندلی‌ها', 'Seat condition'],
  ],
  docs: [
    ['تطبیق شماره شاسی', 'VIN matches documents'],
    ['سال ساخت در سند و خودرو', 'Build year matches registration'],
    ['سابقه بیمه و خلافی', 'Insurance and fines history'],
  ],
};

export function InspectionDemo() {
  const { t, lang, num } = useI18n();
  const [checked, setChecked] = useState({});

  const groups = [
    ['body', t('inspect.group1')],
    ['mechanical', t('inspect.group2')],
    ['cabin', t('inspect.group3')],
    ['docs', t('inspect.group4')],
  ];

  const total = Object.values(CHECKS).flat().length;
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <div className="flow-card">
      <div className="flex-between">
        <h3 className="h3">{t('svc.demo')}</h3>
        <span className="tag tag--cobalt">
          {num(done)} / {num(total)}
        </span>
      </div>
      <div className="progress-bar">
        <i style={{ width: `${(done / total) * 100}%` }} />
      </div>
      {groups.map(([key, label]) => (
        <div key={key}>
          <span className="filters__title">{label}</span>
          <div className="stack" style={{ gap: 8, marginBlockStart: 10 }}>
            {CHECKS[key].map(([fa, en], index) => {
              const id = `${key}-${index}`;
              return (
                <label className="check" key={id}>
                  <input
                    type="checkbox"
                    checked={Boolean(checked[id])}
                    onChange={(event) => setChecked({ ...checked, [id]: event.target.checked })}
                  />
                  <span>{lang === 'fa' ? fa : en}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
      <p className="small muted">
        {lang === 'fa'
          ? 'این چک‌لیست فقط برای تمرین بازدید است. نتیجه‌اش در همین مرورگر می‌ماند و گزارش رسمی نیست.'
          : 'This checklist is for practising a viewing only. It stays in this browser and is not an official report.'}
      </p>
    </div>
  );
}

/* ————————————————————— valuation ————————————————————— */

export function ValuationDemo() {
  const { t, lang, num, money } = useI18n();
  const [form, setForm] = useState({ year: 2021, mileage: 60000, condition: 'good' });

  const estimate = useMemo(() => {
    const base = 2400000000;
    const age = Math.max(0, 2026 - Number(form.year));
    const conditionFactor = { excellent: 1, 'very-good': 0.95, good: 0.88, fair: 0.78 }[form.condition] || 0.9;
    const mileageFactor = Math.max(0.6, 1 - Number(form.mileage) / 400000);
    const value = Math.round((base * Math.pow(0.93, age) * conditionFactor * mileageFactor) / 10000000) * 10000000;
    return { low: Math.round(value * 0.92), high: Math.round(value * 1.06) };
  }, [form]);

  const field = (key, label, options) => (
    <div className="field">
      <label htmlFor={`val-${key}`}>{label}</label>
      <select
        id={`val-${key}`}
        className="select"
        value={form[key]}
        onChange={(event) => setForm({ ...form, [key]: event.target.value })}
      >
        {options.map(([value, text]) => (
          <option value={value} key={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="flow-card">
      <div className="form-grid form-grid--2">
        {field('year', t('v.year'), [2020, 2021, 2022, 2023, 2024].map((year) => [year, num(year)]))}
        {field(
          'mileage',
          t('sell.mileage'),
          [20000, 40000, 60000, 90000, 130000].map((value) => [value, `${num(value)} ${t('v.km')}`]),
        )}
      </div>
      <div className="field">
        <label htmlFor="val-cond">{t('v.bodyCondition')}</label>
        <div className="row" style={{ gap: 6 }}>
          {['excellent', 'very-good', 'good', 'fair'].map((value) => (
            <button
              type="button"
              className="chip"
              key={value}
              aria-pressed={form.condition === value}
              onClick={() => setForm({ ...form, condition: value })}
            >
              {t(`bodycond.${value}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="success-panel">
        <span className="label" style={{ color: 'var(--cobalt)' }}>
          {lang === 'fa' ? 'بازه نمونه' : 'Sample range'}
        </span>
        <strong className="num" style={{ fontSize: '1.5rem' }}>
          {money(estimate.low)} — {money(estimate.high)}
        </strong>
        <p className="small body-soft">
          {lang === 'fa'
            ? 'این عدد از یک فرمول ساده روی داده نمونه ساخته می‌شود و هیچ ارتباطی با قیمت بازار واقعی ندارد.'
            : 'This figure comes from a simple formula over sample data and has no connection to real market pricing.'}
        </p>
      </div>
    </div>
  );
}

/* ————————————————————— generic demo request form ————————————————————— */

export function DemoRequestForm({ kind = 'consultation', fields = ['name', 'contact', 'message'] }) {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = t('form.required');
    if (form.contact.trim().length < 3) next.contact = t('form.required');
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await api.post('/inquiries', { kind, ...form });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="success-panel">
        <span className="success-panel__icon">
          <Icon name="check" size={20} />
        </span>
        <h3 className="h3">{t('form.successTitle')}</h3>
        <p className="small body-soft">{t('form.successBody')}</p>
        <button type="button" className="btn btn--ink btn--sm" onClick={() => setSent(false)}>
          {t('form.another')}
        </button>
      </div>
    );
  }

  return (
    <form className="flow-card" onSubmit={submit} noValidate>
      <h3 className="h3">{t('svc.demo')}</h3>
      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor={`d-${kind}-name`}>{t('contact.name')}</label>
          <input
            id={`d-${kind}-name`}
            className="input"
            value={form.name}
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="field">
          <label htmlFor={`d-${kind}-contact`}>{t('contact.email')}</label>
          <input
            id={`d-${kind}-contact`}
            className="input"
            dir="ltr"
            value={form.contact}
            aria-invalid={Boolean(errors.contact)}
            onChange={(event) => setForm({ ...form, contact: event.target.value })}
          />
          {errors.contact && <span className="field-error">{errors.contact}</span>}
        </div>
      </div>
      <div className="field">
        <label htmlFor={`d-${kind}-msg`}>{t('contact.message')}</label>
        <textarea
          id={`d-${kind}-msg`}
          className="textarea"
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
        />
      </div>
      <p className="small muted">{t('form.simulated')}</p>
      <button className="btn btn--primary" type="submit" disabled={busy}>
        {busy ? t('act.loading') : t('form.confirm')}
      </button>
    </form>
  );
}
