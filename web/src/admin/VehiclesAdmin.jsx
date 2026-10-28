import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import { Icon } from '../components/Icons.jsx';

const BLANK = {
  make_fa: '',
  make_en: '',
  model_fa: '',
  model_en: '',
  trim_fa: '',
  category: 'domestic',
  body_style: 'sedan',
  year_gregorian: 2023,
  year_shamsi: 1402,
  mileage_km: 0,
  price_demo: 1000000000,
  price_band: 'mid',
  fuel: 'petrol',
  transmission: 'automatic',
  status: 'draft',
  featured: false,
  tone: '#1d2432',
  accent: '#415CF0',
  note_fa: '',
  note_en: '',
};

export default function VehiclesAdmin() {
  const { t, bi, num, money, lang } = useI18n();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');

  const load = () =>
    api
      .get('/admin/vehicles')
      .then((data) => setItems(data.items || []))
      .catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      if (editing.id) {
        await api.patch(`/admin/vehicles/${editing.id}`, editing);
      } else {
        await api.post('/admin/vehicles', editing);
      }
      setFlash(t('admin.saved'));
      setEditing(null);
      await load();
      setTimeout(() => setFlash(''), 2400);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (vehicle, field) => {
    await api.patch(`/admin/vehicles/${vehicle.id}`, {
      [field]:
        field === 'status'
          ? vehicle.status === 'published'
            ? 'draft'
            : 'published'
          : !vehicle.featured,
    });
    await load();
  };

  const remove = async (vehicle) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    await api.del(`/admin/vehicles/${vehicle.id}`);
    await load();
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="admin-head">
        <div>
          <h1>{t('admin.vehicles')}</h1>
          <p className="small muted">
            {num(items.length)} — {t('admin.syntheticOnly')}
          </p>
        </div>
        <div className="row">
          {flash && <span className="tag tag--cobalt">{flash}</span>}
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setEditing({ ...BLANK })}>
            <Icon name="plus" size={14} />
            {t('admin.addVehicle')}
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('v.model')}</th>
              <th>{t('v.category')}</th>
              <th>{t('v.price')}</th>
              <th>{t('v.year')}</th>
              <th>{t('v.condition')}</th>
              <th>{t('admin.featured')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>
                  <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}>
                    <div style={{ width: 58, height: 38, borderRadius: 8, overflow: 'hidden', background: '#0c0f16', flexShrink: 0 }}>
                      <VehicleArt tone={vehicle.tone} accent={vehicle.accent} angle="front" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {bi(vehicle, 'make')} {bi(vehicle, 'model')}
                      </div>
                      <div className="small muted">{bi(vehicle, 'trim')}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="small">{t(`cat.${vehicle.category}.short`)}</span>
                </td>
                <td className="num">
                  {money(vehicle.price_demo)}
                  <div className="small muted">{t(`band.${vehicle.price_band}`)}</div>
                </td>
                <td className="num">{num(vehicle.year_shamsi)}</td>
                <td>
                  <span className={`status-dot status-dot--${vehicle.status === 'published' ? 'published' : 'draft'}`}>
                    {vehicle.status === 'published' ? t('admin.publish') : t('admin.draft')}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="mini-btn"
                    aria-pressed={vehicle.featured}
                    aria-label={t('admin.featured')}
                    onClick={() => toggle(vehicle, 'featured')}
                  >
                    <Icon name="star" size={14} />
                  </button>
                </td>
                <td>
                  <div className="row" style={{ gap: 4, flexWrap: 'nowrap' }}>
                    <button
                      type="button"
                      className="mini-btn"
                      aria-label={t('admin.publish')}
                      title={vehicle.status === 'published' ? t('admin.draft') : t('admin.publish')}
                      onClick={() => toggle(vehicle, 'status')}
                    >
                      <Icon name={vehicle.status === 'published' ? 'eye' : 'upload'} size={14} />
                    </button>
                    <button type="button" className="mini-btn" aria-label={t('act.edit')} onClick={() => setEditing({ ...vehicle })}>
                      <Icon name="edit" size={14} />
                    </button>
                    <button type="button" className="mini-btn" aria-label={t('act.delete')} onClick={() => remove(vehicle)}>
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)} role="dialog" aria-modal="true">
          <div className="modal" onClick={(event) => event.stopPropagation()} style={{ width: 'min(760px, 100%)' }}>
            <div className="flex-between">
              <h2 className="h3">{editing.id ? t('admin.editVehicle') : t('admin.addVehicle')}</h2>
              <button type="button" className="icon-btn" onClick={() => setEditing(null)} aria-label={t('act.close')}>
                <Icon name="close" />
              </button>
            </div>

            <div className="form-grid form-grid--2">
              {[
                ['make_fa', 'برند (فارسی)'],
                ['make_en', 'Make (English)'],
                ['model_fa', 'مدل (فارسی)'],
                ['model_en', 'Model (English)'],
                ['trim_fa', 'تیپ (فارسی)'],
                ['trim_en', 'Trim (English)'],
              ].map(([key, label]) => (
                <div className="field" key={key}>
                  <label htmlFor={`v-${key}`}>{label}</label>
                  <input
                    id={`v-${key}`}
                    className="input"
                    value={editing[key] || ''}
                    onChange={(event) => setEditing({ ...editing, [key]: event.target.value })}
                  />
                </div>
              ))}

              <div className="field">
                <label htmlFor="v-cat">{t('v.category')}</label>
                <select
                  id="v-cat"
                  className="select"
                  value={editing.category}
                  onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                >
                  {['domestic', 'imported', 'assembled'].map((value) => (
                    <option value={value} key={value}>
                      {t(`cat.${value}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="v-body">{t('v.bodyStyle')}</label>
                <select
                  id="v-body"
                  className="select"
                  value={editing.body_style}
                  onChange={(event) => setEditing({ ...editing, body_style: event.target.value })}
                >
                  {['sedan', 'hatchback', 'suv', 'crossover'].map((value) => (
                    <option value={value} key={value}>
                      {t(`body.${value}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="v-year">{t('v.yearShamsi')}</label>
                <input
                  id="v-year"
                  className="input num"
                  type="number"
                  dir="ltr"
                  value={editing.year_shamsi}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      year_shamsi: Number(event.target.value),
                      year_gregorian: Number(event.target.value) + 621,
                    })
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="v-mileage">{t('v.mileage')}</label>
                <input
                  id="v-mileage"
                  className="input num"
                  type="number"
                  dir="ltr"
                  value={editing.mileage_km}
                  onChange={(event) => setEditing({ ...editing, mileage_km: Number(event.target.value) })}
                />
              </div>

              <div className="field">
                <label htmlFor="v-price">{t('v.price')}</label>
                <input
                  id="v-price"
                  className="input num"
                  type="number"
                  dir="ltr"
                  value={editing.price_demo}
                  onChange={(event) => setEditing({ ...editing, price_demo: Number(event.target.value) })}
                />
              </div>

              <div className="field">
                <label htmlFor="v-band">{t('cat.priceRange')}</label>
                <select
                  id="v-band"
                  className="select"
                  value={editing.price_band}
                  onChange={(event) => setEditing({ ...editing, price_band: event.target.value })}
                >
                  {['economy', 'mid', 'premium', 'luxury'].map((value) => (
                    <option value={value} key={value}>
                      {t(`band.${value}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="v-status">{t('admin.publish')}</label>
                <select
                  id="v-status"
                  className="select"
                  value={editing.status}
                  onChange={(event) => setEditing({ ...editing, status: event.target.value })}
                >
                  <option value="published">{t('admin.publish')}</option>
                  <option value="draft">{t('admin.draft')}</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="v-tone">{lang === 'fa' ? 'رنگ پایه طرح مفهومی' : 'Concept art tone'}</label>
                <input
                  id="v-tone"
                  className="input"
                  type="color"
                  value={editing.tone || '#1d2432'}
                  onChange={(event) => setEditing({ ...editing, tone: event.target.value })}
                />
              </div>

              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="v-note-fa">{lang === 'fa' ? 'توضیح فارسی' : 'Persian note'}</label>
                <textarea
                  id="v-note-fa"
                  className="textarea"
                  value={editing.note_fa || ''}
                  onChange={(event) => setEditing({ ...editing, note_fa: event.target.value })}
                />
              </div>

              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="v-note-en">{lang === 'fa' ? 'توضیح انگلیسی' : 'English note'}</label>
                <textarea
                  id="v-note-en"
                  className="textarea"
                  value={editing.note_en || ''}
                  onChange={(event) => setEditing({ ...editing, note_en: event.target.value })}
                />
              </div>
            </div>

            <div className="flow-nav">
              <button type="button" className="btn btn--ghost" onClick={() => setEditing(null)}>
                {t('act.cancel')}
              </button>
              <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
                {saving ? t('act.loading') : t('act.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
