import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { useLibrary } from '../lib/store.jsx';
import { Reveal } from '../lib/motion.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import { Icon } from '../components/Icons.jsx';

const ANGLES = ['front', 'quarter', 'profile', 'cabin'];

function SpecRows({ vehicle }) {
  const { t, num } = useI18n();
  const specs = vehicle.specs || {};
  const rows = [
    ['spec.power', specs.power_hp, 'spec.hp'],
    ['spec.torque', specs.torque_nm, 'spec.nm'],
    ['spec.accel', specs.accel_0_100, 'spec.sec'],
    ['spec.consumption', specs.consumption_l100, 'spec.l100'],
    ['spec.length', specs.length_mm, 'spec.mm'],
    ['spec.width', specs.width_mm, 'spec.mm'],
    ['spec.height', specs.height_mm, 'spec.mm'],
    ['spec.wheelbase', specs.wheelbase_mm, 'spec.mm'],
    ['spec.boot', specs.boot_l, 'spec.l'],
    ['spec.seats', specs.seats, ''],
    ['spec.doors', specs.doors, ''],
  ].filter(([, value]) => value !== undefined && value !== null);

  return (
    <div className="spec-grid">
      {rows.map(([label, value, unit]) => (
        <div className="spec-cell" key={label}>
          <span className="spec-cell__label">{t(label)}</span>
          <span className="spec-cell__value num">
            {num(value)} {unit ? <span className="small muted">{t(unit)}</span> : null}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function VehicleDetail() {
  const { slug } = useParams();
  const { t, bi, num, money, lang } = useI18n();
  const { isFavorite, toggleFavorite, isCompared, toggleCompare } = useLibrary();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const [visitOpen, setVisitOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    api
      .get(`/vehicles/${slug}`)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.status === 404 ? '404' : err.message));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    setActive(0);
  }, [slug]);

  const gallery = useMemo(() => {
    if (!data?.vehicle) return [];
    const list = Array.isArray(data.vehicle.gallery) ? data.vehicle.gallery : [];
    return ANGLES.map((angle, index) => {
      const match = list.find((item) => item.angle === angle);
      return {
        angle,
        label: lang === 'fa' ? match?.label_fa || angle : match?.label_en || angle,
        tone: match?.tone || data.vehicle.tone,
        accent: match?.accent || data.vehicle.accent,
        url: match?.url,
      };
    });
  }, [data, lang]);

  if (error === '404') {
    return (
      <section className="page-hero">
        <div className="shell">
          <h1>{t('nf.title')}</h1>
          <p>{t('nf.desc')}</p>
          <Link className="btn btn--ink" to="/vehicles">
            {t('nav.vehicles')}
          </Link>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <div className="shell" style={{ paddingBlock: 'calc(var(--header-h) + 40px)' }}>
        <div className="skeleton" style={{ height: 460 }} />
      </div>
    );
  }

  const { vehicle, related } = data;
  const fav = isFavorite(vehicle.slug);
  const compared = isCompared(vehicle.slug);
  const current = gallery[active] || gallery[0];

  return (
    <>
      <div className="shell">
        <div className="vd-top">
          <div className="gallery">
            <div className="gallery__main">
              {current?.url ? (
                <img src={current.url} alt={`${bi(vehicle, 'make')} ${bi(vehicle, 'model')}`} />
              ) : (
                <VehicleArt tone={current?.tone} accent={current?.accent} angle={current?.angle || 'front'} />
              )}
              <span className="gallery__tag tag">{t('v.conceptArt')}</span>
              <div className="gallery__nav">
                <button
                  type="button"
                  aria-label={t('act.prev')}
                  onClick={() => setActive((index) => (index - 1 + gallery.length) % gallery.length)}
                >
                  <Icon name="chevronStart" size={15} className="rtl-flip" />
                </button>
                <button
                  type="button"
                  aria-label={t('act.next')}
                  onClick={() => setActive((index) => (index + 1) % gallery.length)}
                >
                  <Icon name="chevronEnd" size={15} className="rtl-flip" />
                </button>
              </div>
            </div>
            <div className="gallery__thumbs">
              {gallery.map((item, index) => (
                <button
                  type="button"
                  key={item.angle}
                  aria-current={index === active}
                  aria-label={item.label}
                  onClick={() => setActive(index)}
                >
                  {item.url ? (
                    <img src={item.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <VehicleArt tone={item.tone} accent={item.accent} angle={item.angle} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="vd-info">
            <nav className="breadcrumbs" aria-label={t('nav.menu')}>
              <Link to="/">{t('nav.home')}</Link>
              <span className="sep">/</span>
              <Link to={`/vehicles/${vehicle.category}`}>{t(`cat.${vehicle.category}`)}</Link>
              <span className="sep">/</span>
              <span>
                {bi(vehicle, 'make')} {bi(vehicle, 'model')}
              </span>
            </nav>

            <div>
              <span className="label">
                {bi(vehicle, 'make')} · {num(vehicle.year_shamsi)} · {t(`body.${vehicle.body_style}`)}
              </span>
              <h1>
                {bi(vehicle, 'make')} {bi(vehicle, 'model')}
              </h1>
              <p className="muted small">{bi(vehicle, 'trim')}</p>
            </div>

            <div className="vd-price">
              <strong className="num">{money(vehicle.price_demo)}</strong>
              <span className="small muted">{t('v.toman')} — {t('v.price')}</span>
            </div>

            <div className="vd-quick">
              <div>
                <span>{t('v.mileage')}</span>
                <strong className="num">
                  {num(vehicle.mileage_km)} {t('v.km')}
                </strong>
              </div>
              <div>
                <span>{t('v.transmission')}</span>
                <strong>{t(`trans.${vehicle.transmission}`)}</strong>
              </div>
              <div>
                <span>{t('v.fuel')}</span>
                <strong>{t(`fuel.${vehicle.fuel}`)}</strong>
              </div>
            </div>

            <div className="feature-pills">
              <span>{t(`cond.${vehicle.condition}`)}</span>
              <span>{t(`bodycond.${vehicle.body_condition}`)}</span>
              <span>{bi(vehicle, 'color')}</span>
              <span>{t(`band.${vehicle.price_band}`)}</span>
            </div>

            <div className="vd-actions">
              <button type="button" className="btn btn--primary" onClick={() => setVisitOpen(true)}>
                {t('v.requestVisit')}
                <Icon name="calendar" size={16} />
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                aria-pressed={fav}
                onClick={() => toggleFavorite(vehicle.slug)}
              >
                <Icon name="heart" filled={fav} size={16} />
                {fav ? t('v.removeFav') : t('v.addFav')}
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                aria-pressed={compared}
                onClick={() => toggleCompare(vehicle.slug)}
              >
                <Icon name="compare" size={16} />
                {compared ? t('v.removeCompare') : t('v.addCompare')}
              </button>
            </div>

            <p className="vd-disclaimer">
              <Icon name="info" size={13} style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: 6 }} />
              {t('v.demoNote')}
            </p>
          </div>
        </div>
      </div>

      <section className="section section--tight" style={{ borderBlockStart: '1px solid var(--hairline)' }}>
        <div className="shell">
          <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,64px)' }}>
            <div>
              <span className="kicker">{t('v.overview')}</span>
              <p className="lead mt-2">{bi(vehicle, 'note')}</p>

              <h2 className="h3 mt-4">{t('v.specs')}</h2>
              <p className="small muted" style={{ marginBlock: '6px 14px' }}>
                {t('spec.illustrative')}
              </p>
              <SpecRows vehicle={vehicle} />

              <h2 className="h3 mt-4">{t('v.features')}</h2>
              <div className="feature-pills mt-2">
                {(vehicle.features || []).map((key) => (
                  <span key={key}>{t(`feat.${key}`)}</span>
                ))}
              </div>
            </div>

            <aside className="stack">
              <div className="card">
                <h2 className="h3">{t('v.inspection')}</h2>
                <p className="small muted mt-1">
                  {lang === 'fa'
                    ? 'این فهرست، پیشنهاد بازدید است — نه گزارش کارشناسی و نه تأییدیه.'
                    : 'This is a viewing checklist — not an inspection report and not a certification.'}
                </p>
                <dl className="spec-list mt-2">
                  {[
                    [t('v.bodyCondition'), t(`bodycond.${vehicle.body_condition}`)],
                    [t('v.mileage'), `${num(vehicle.mileage_km)} ${t('v.km')}`],
                    [t('v.year'), `${num(vehicle.year_shamsi)} / ${num(vehicle.year_gregorian)}`],
                    [t('v.color'), bi(vehicle, 'color')],
                    [t('v.interior'), bi(vehicle, 'interior')],
                    [t('v.engine'), bi(vehicle, 'engine')],
                  ].map(([label, value]) => (
                    <div className="spec-row" key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <Link className="btn btn--ghost btn--sm mt-2" to="/services/inspection">
                  {t('svc.process')}
                  <Icon name="shield" size={14} />
                </Link>
              </div>

              <div className="card" style={{ background: 'var(--ink)', color: 'var(--on-dark)', borderColor: 'var(--ink-line)' }}>
                <span className="label" style={{ color: 'var(--bronze-soft)' }}>
                  {t('cmp.title')}
                </span>
                <p className="small mt-1" style={{ color: 'rgba(243,242,238,0.68)' }}>
                  {t('cmp.desc')}
                </p>
                <Link className="btn btn--light btn--sm mt-2" to="/compare">
                  {t('nav.compare')}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related?.length > 0 && (
        <section className="section section--ivory2">
          <div className="shell">
            <div className="flex-between" style={{ marginBlockEnd: 22 }}>
              <h2 className="h2">{t('v.similar')}</h2>
              <Link className="link-arrow" to={`/vehicles/${vehicle.category}`}>
                {t('cat.all')}
                <Icon name="arrowEnd" size={15} className="rtl-flip" />
              </Link>
            </div>
            <div className="vehicle-grid">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 0.06}>
                  <VehicleCard vehicle={item} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {visitOpen && (
        <VisitModal vehicle={vehicle} onClose={() => setVisitOpen(false)} />
      )}
    </>
  );
}

function VisitModal({ vehicle, onClose }) {
  const { t, bi } = useI18n();
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = t('form.required');
    if (!form.contact.trim()) next.contact = t('form.required');
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await api.post('/inquiries', {
        kind: 'viewing',
        name: form.name,
        contact: form.contact,
        message: form.message,
        vehicleSlug: vehicle.slug,
      });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('v.requestVisit')}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div className="flex-between">
          <h3 className="h3">{t('v.requestVisit')}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('nav.close')}>
            <Icon name="close" />
          </button>
        </div>
        <p className="small muted">
          {bi(vehicle, 'make')} {bi(vehicle, 'model')} — {bi(vehicle, 'trim')}
        </p>

        {sent ? (
          <div className="success-panel">
            <span className="success-panel__icon">
              <Icon name="check" size={20} />
            </span>
            <h3 className="h3">{t('form.successTitle')}</h3>
            <p className="small body-soft">{t('form.successBody')}</p>
            <button type="button" className="btn btn--ink btn--sm" onClick={onClose}>
              {t('act.close')}
            </button>
          </div>
        ) : (
          <form className="stack" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="visit-name">{t('contact.name')}</label>
              <input
                id="visit-name"
                className="input"
                value={form.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor="visit-contact">{t('contact.email')}</label>
              <input
                id="visit-contact"
                className="input"
                dir="ltr"
                value={form.contact}
                aria-invalid={Boolean(errors.contact)}
                onChange={(event) => setForm({ ...form, contact: event.target.value })}
              />
              {errors.contact && <span className="field-error">{errors.contact}</span>}
            </div>
            <div className="field">
              <label htmlFor="visit-message">{t('contact.message')}</label>
              <textarea
                id="visit-message"
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
        )}
      </div>
    </div>
  );
}
