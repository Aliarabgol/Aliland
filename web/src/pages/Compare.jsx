import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { useLibrary } from '../lib/store.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Compare() {
  const { compare, clearCompare, toggleCompare } = useLibrary();
  const { t, bi, num, money } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);

  useEffect(() => {
    if (!compare.length) {
      setItems([]);
      return;
    }
    setLoading(true);
    api
      .get(`/vehicles?slugs=${compare.join(',')}`)
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [compare]);

  const rows = useMemo(() => {
    const defs = [
      ['v.price', (v) => money(v.price_demo)],
      ['v.category', (v) => t(`cat.${v.category}.short`)],
      ['v.bodyStyle', (v) => t(`body.${v.body_style}`)],
      ['v.year', (v) => `${num(v.year_shamsi)} / ${num(v.year_gregorian)}`],
      ['v.mileage', (v) => `${num(v.mileage_km)} ${t('v.km')}`],
      ['v.engine', (v) => bi(v, 'engine')],
      ['v.fuel', (v) => t(`fuel.${v.fuel}`)],
      ['v.transmission', (v) => t(`trans.${v.transmission}`)],
      ['v.condition', (v) => t(`cond.${v.condition}`)],
      ['v.bodyCondition', (v) => t(`bodycond.${v.body_condition}`)],
      ['spec.power', (v) => `${num(v.specs?.power_hp)} ${t('spec.hp')}`],
      ['spec.torque', (v) => `${num(v.specs?.torque_nm)} ${t('spec.nm')}`],
      ['spec.accel', (v) => `${num(v.specs?.accel_0_100)} ${t('spec.sec')}`],
      ['spec.consumption', (v) => `${num(v.specs?.consumption_l100)} ${t('spec.l100')}`],
      ['spec.seats', (v) => num(v.specs?.seats)],
      ['spec.boot', (v) => `${num(v.specs?.boot_l)} ${t('spec.l')}`],
      ['v.features', (v) => `${num((v.features || []).length)}`],
    ];
    const computed = defs.map(([label, fn]) => ({
      label,
      values: items.map((vehicle) => fn(vehicle)),
    }));
    if (!diffOnly) return computed;
    return computed.filter((row) => new Set(row.values).size > 1);
  }, [items, diffOnly, t, bi, num, money]);

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('cmp.title')}</span>
          </nav>
          <h1>{t('cmp.title')}</h1>
          <p>{t('cmp.desc')}</p>
          <div className="row">
            <span className="tag tag--cobalt">
              <Icon name="compare" size={13} />
              {num(items.length)} / {num(3)}
            </span>
            {items.length > 0 && (
              <button type="button" className="btn btn--ghost btn--sm" onClick={clearCompare}>
                {t('cmp.clearAll')}
              </button>
            )}
            <label className="check" style={{ marginInlineStart: 'auto' }}>
              <input type="checkbox" checked={diffOnly} onChange={(event) => setDiffOnly(event.target.checked)} />
              <span className="small">{t('cmp.diffOnly')}</span>
            </label>
          </div>
        </div>
      </section>

      <div className="shell" style={{ paddingBlock: 'clamp(26px,4vw,50px) clamp(50px,8vw,90px)' }}>
        {loading ? (
          <div className="skeleton" style={{ height: 400 }} />
        ) : items.length === 0 ? (
          <div className="empty-state">
            <Icon name="compare" size={32} />
            <h3>{t('cmp.empty')}</h3>
            <p className="muted small">{t('cmp.emptyHint')}</p>
            <Link className="btn btn--primary" to="/vehicles">
              {t('nav.allVehicles')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 140 }}>{t('cmp.item')}</th>
                  {items.map((vehicle) => (
                    <th key={vehicle.slug} style={{ minWidth: 210 }}>
                      <div style={{ display: 'grid', gap: 8 }}>
                        <div style={{ borderRadius: 12, overflow: 'hidden', background: '#0c0f16' }}>
                          <VehicleArt tone={vehicle.tone} accent={vehicle.accent} angle="front" />
                        </div>
                        <Link to={`/vehicle/${vehicle.slug}`} style={{ fontWeight: 700 }}>
                          {bi(vehicle, 'make')} {bi(vehicle, 'model')}
                        </Link>
                        <span className="small muted">{bi(vehicle, 'trim')}</span>
                        <button
                          type="button"
                          className="small"
                          onClick={() => toggleCompare(vehicle.slug)}
                          style={{ color: 'var(--cobalt)', textAlign: 'start', fontWeight: 700 }}
                        >
                          {t('cmp.remove')}
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className={new Set(row.values).size > 1 ? 'is-diff' : ''}>
                    <th scope="row">{t(row.label)}</th>
                    {row.values.map((value, index) => (
                      <td key={`${row.label}-${index}`} className="num">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="small muted mt-3">{t('v.demoNote')}</p>
      </div>
    </>
  );
}
