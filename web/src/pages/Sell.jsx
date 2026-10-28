import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from '../components/Icons.jsx';

const DRAFT_KEY = 'aliland.sellDraft';
const STEPS = ['sell.step1', 'sell.step2', 'sell.step3', 'sell.step4'];

/** Accepts Persian (۰-۹), Arabic-Indic (٠-٩) and Latin digits. */
function normaliseNumber(input) {
  const map = { '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9' };
  return String(input)
    .replace(/[۰-۹]/g, (d) => map[d])
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[^\d]/g, '');
}

export default function Sell() {
  const { t, lang, num } = useI18n();
  const [step, setStep] = useState(0);
  const [catalogue, setCatalogue] = useState([]);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [photos, setPhotos] = useState([]);

  const [form, setForm] = useState(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return {
      make: '',
      model: '',
      trim: '',
      year: '',
      mileage: '',
      transmission: 'automatic',
      fuel: 'petrol',
      bodyCondition: 'good',
      technical: 'good',
      color: '',
      city: '',
      expected: '',
      notes: '',
    };
  });

  useEffect(() => {
    api.get('/vehicles?perPage=48').then((data) => setCatalogue(data.items || [])).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* storage unavailable */
    }
  }, [form]);

  const makes = useMemo(() => {
    const map = new Map();
    for (const vehicle of catalogue) {
      const key = vehicle.make_slug;
      if (!map.has(key)) map.set(key, { slug: key, fa: vehicle.make_fa, en: vehicle.make_en });
    }
    return [...map.values()];
  }, [catalogue]);

  const models = useMemo(
    () => catalogue.filter((vehicle) => vehicle.make_slug === form.make),
    [catalogue, form.make],
  );

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (index) => {
    const next = {};
    if (index === 0) {
      if (!form.make) next.make = t('form.required');
      if (!form.model) next.model = t('form.required');
      if (!form.year) next.year = t('form.required');
    }
    if (index === 1) {
      if (!form.mileage) next.mileage = t('form.required');
    }
    if (index === 2) {
      if (!form.city.trim()) next.city = t('form.required');
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  };

  const submit = async () => {
    setBusy(true);
    try {
      await api.post('/inquiries', {
        kind: 'sell',
        name: form.city || 'sell demo',
        contact: form.trim || 'demo',
        message: JSON.stringify(form),
      });
      setSent(true);
      localStorage.removeItem(DRAFT_KEY);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <section className="section">
        <div className="shell" style={{ maxWidth: 720 }}>
          <div className="success-panel">
            <span className="success-panel__icon">
              <Icon name="check" size={20} />
            </span>
            <h1 className="h2">{t('form.successTitle')}</h1>
            <p className="body-soft">{t('form.successBody')}</p>
            <div className="row">
              <Link className="btn btn--primary" to="/vehicles">
                {t('nav.allVehicles')}
              </Link>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setSent(false);
                  setStep(0);
                }}
              >
                {t('form.another')}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('sell.title')}</span>
          </nav>
          <h1>{t('sell.title')}</h1>
          <p>{t('sell.desc')}</p>
        </div>
      </section>

      <div className="shell">
        <div className="flow">
          <div className="progress-bar" style={{ marginBlockEnd: 18 }}>
            <i style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>

          <div className="stepper" style={{ marginBlockEnd: 18 }}>
            {STEPS.map((key, index) => (
              <span
                key={key}
                className={`stepper__item${index === step ? ' is-active' : ''}${index < step ? ' is-done' : ''}`}
              >
                {t(key)}
              </span>
            ))}
          </div>

          <div className="flow-card">
            <div className="flex-between">
              <span className="label">{t('form.step', { n: num(step + 1), total: num(STEPS.length) })}</span>
              <span className="small muted">{t('form.draftSaved')}</span>
            </div>

            {step === 0 && (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="s-make">{t('sell.make')} *</label>
                  <select
                    id="s-make"
                    className="select"
                    value={form.make}
                    aria-invalid={Boolean(errors.make)}
                    onChange={(event) => {
                      set('make', event.target.value);
                      set('model', '');
                    }}
                  >
                    <option value="">{t('trade.pick')}</option>
                    {makes.map((make) => (
                      <option value={make.slug} key={make.slug}>
                        {lang === 'fa' ? make.fa : make.en}
                      </option>
                    ))}
                  </select>
                  {errors.make && <span className="field-error">{errors.make}</span>}
                </div>

                <div className="field">
                  <label htmlFor="s-model">{t('sell.model')} *</label>
                  <select
                    id="s-model"
                    className="select"
                    value={form.model}
                    disabled={!form.make}
                    aria-invalid={Boolean(errors.model)}
                    onChange={(event) => set('model', event.target.value)}
                  >
                    <option value="">{t('trade.pick')}</option>
                    {models.map((vehicle) => (
                      <option value={vehicle.model_fa} key={vehicle.slug}>
                        {lang === 'fa' ? vehicle.model_fa : vehicle.model_en}
                      </option>
                    ))}
                  </select>
                  {errors.model && <span className="field-error">{errors.model}</span>}
                </div>

                <div className="field">
                  <label htmlFor="s-trim">{t('sell.trim')}</label>
                  <input
                    id="s-trim"
                    className="input"
                    value={form.trim}
                    onChange={(event) => set('trim', event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="s-year">{t('sell.year')} *</label>
                  <select
                    id="s-year"
                    className="select"
                    value={form.year}
                    aria-invalid={Boolean(errors.year)}
                    onChange={(event) => set('year', event.target.value)}
                  >
                    <option value="">{t('trade.pick')}</option>
                    {[1390, 1395, 1398, 1399, 1400, 1401, 1402, 1403, 1404].map((year) => (
                      <option value={year} key={year}>
                        {num(year)}
                      </option>
                    ))}
                  </select>
                  {errors.year && <span className="field-error">{errors.year}</span>}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="s-mileage">{t('sell.mileage')} *</label>
                  <input
                    id="s-mileage"
                    className="input num"
                    inputMode="numeric"
                    dir="ltr"
                    value={form.mileage}
                    aria-invalid={Boolean(errors.mileage)}
                    onChange={(event) => set('mileage', normaliseNumber(event.target.value))}
                  />
                  {errors.mileage && <span className="field-error">{errors.mileage}</span>}
                </div>

                <div className="field">
                  <label htmlFor="s-trans">{t('sell.transmission')}</label>
                  <select
                    id="s-trans"
                    className="select"
                    value={form.transmission}
                    onChange={(event) => set('transmission', event.target.value)}
                  >
                    {['manual', 'automatic', 'cvt', 'dct'].map((value) => (
                      <option value={value} key={value}>
                        {t(`trans.${value}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="s-fuel">{t('sell.fuel')}</label>
                  <select
                    id="s-fuel"
                    className="select"
                    value={form.fuel}
                    onChange={(event) => set('fuel', event.target.value)}
                  >
                    {['petrol', 'hybrid', 'electric', 'diesel'].map((value) => (
                      <option value={value} key={value}>
                        {t(`fuel.${value}`)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <span className="field-label">{t('sell.bodyCondition')}</span>
                  <div className="row" style={{ gap: 6 }}>
                    {['excellent', 'very-good', 'good', 'fair'].map((value) => (
                      <button
                        type="button"
                        className="chip"
                        key={value}
                        aria-pressed={form.bodyCondition === value}
                        onClick={() => set('bodyCondition', value)}
                      >
                        {t(`bodycond.${value}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <span className="field-label">{t('sell.technical')}</span>
                  <div className="row" style={{ gap: 6 }}>
                    {['excellent', 'very-good', 'good', 'fair'].map((value) => (
                      <button
                        type="button"
                        className="chip"
                        key={value}
                        aria-pressed={form.technical === value}
                        onClick={() => set('technical', value)}
                      >
                        {t(`bodycond.${value}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="s-city">{t('sell.city')} *</label>
                  <input
                    id="s-city"
                    className="input"
                    value={form.city}
                    aria-invalid={Boolean(errors.city)}
                    onChange={(event) => set('city', event.target.value)}
                  />
                  {errors.city && <span className="field-error">{errors.city}</span>}
                </div>

                <div className="field">
                  <label htmlFor="s-color">{t('sell.color')}</label>
                  <input
                    id="s-color"
                    className="input"
                    value={form.color}
                    onChange={(event) => set('color', event.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="s-expected">{t('sell.expected')}</label>
                  <input
                    id="s-expected"
                    className="input num"
                    inputMode="numeric"
                    dir="ltr"
                    value={form.expected}
                    onChange={(event) => set('expected', normaliseNumber(event.target.value))}
                  />
                </div>

                <div className="field">
                  <label htmlFor="s-photos">{t('sell.photos')}</label>
                  <input
                    id="s-photos"
                    className="input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(event) => setPhotos([...event.target.files].map((file) => file.name))}
                  />
                  <span className="hint">{t('sell.photosHint')}</span>
                  {photos.length > 0 && <span className="small muted">{photos.join(' · ')}</span>}
                </div>

                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="s-notes">{t('sell.notes')}</label>
                  <textarea
                    id="s-notes"
                    className="textarea"
                    value={form.notes}
                    onChange={(event) => set('notes', event.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <>
                <div className="review-grid">
                  {[
                    [t('sell.make'), form.make],
                    [t('sell.model'), form.model],
                    [t('sell.trim'), form.trim || '—'],
                    [t('sell.year'), form.year ? num(form.year) : '—'],
                    [t('sell.mileage'), form.mileage ? `${num(form.mileage)} ${t('v.km')}` : '—'],
                    [t('sell.transmission'), t(`trans.${form.transmission}`)],
                    [t('sell.fuel'), t(`fuel.${form.fuel}`)],
                    [t('sell.bodyCondition'), t(`bodycond.${form.bodyCondition}`)],
                    [t('sell.technical'), t(`bodycond.${form.technical}`)],
                    [t('sell.city'), form.city || '—'],
                    [t('sell.color'), form.color || '—'],
                    [t('sell.expected'), form.expected ? num(form.expected) : '—'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
                <p className="small muted">{t('form.simulated')}</p>
              </>
            )}

            <div className="flow-nav">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                disabled={step === 0}
              >
                <Icon name="chevronStart" size={15} className="rtl-flip" />
                {t('act.prev')}
              </button>

              {step < STEPS.length - 1 ? (
                <button type="button" className="btn btn--primary" onClick={goNext}>
                  {t('act.next')}
                  <Icon name="chevronEnd" size={15} className="rtl-flip" />
                </button>
              ) : (
                <button type="button" className="btn btn--primary" onClick={submit} disabled={busy}>
                  {busy ? t('act.loading') : t('form.confirm')}
                  <Icon name="check" size={15} />
                </button>
              )}
            </div>
          </div>

          <p className="small muted mt-3" style={{ textAlign: 'center' }}>
            {lang === 'fa'
              ? 'این فرم اطلاعاتی به هیچ کسی ارسال نمی‌کند. پیش‌نویس شما فقط در همین مرورگر ذخیره می‌شود.'
              : 'This form sends nothing to anyone. Your draft is stored in this browser only.'}
          </p>
        </div>
      </div>
    </>
  );
}
