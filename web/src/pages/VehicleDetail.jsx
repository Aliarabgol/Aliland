import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useLeadSubmit } from '../lib/useLead.js';
import { Gallery } from '../components/Gallery.jsx';
import { InspectionMap } from '../components/InspectionMap.jsx';
import { PriceDisplay } from '../components/PriceDisplay.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { VehicleCard } from '../components/VehicleCard.jsx';
import { ErrorState } from '../components/States.jsx';
import { TextField, TextareaField, SelectField, PrivacyCheckbox, FormMessage, SubmitButton } from '../components/form.jsx';
import { dateLabel, faNum, mileageLabel, yearLabel } from '../lib/format.js';

const SLOTS = ['صبح (۹ تا ۱۲)', 'بعدازظهر (۱۲ تا ۱۶)', 'عصر (۱۶ تا ۱۹)'];
const val = (x) => (x === null || x === undefined || x === '' ? 'ثبت نشده' : x);

function ViewingForm({ vehicle }) {
  const lead = useLeadSubmit('viewing');
  const [form, setForm] = useState({ name: '', phone: '', preferredDate: '', preferredSlot: '', message: '', privacy: false });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const today = new Date().toISOString().slice(0, 10);

  if (lead.result) {
    return (
      <div className="form-success card-pad" role="status">
        <h3>درخواست ثبت شد</h3>
        <p>{lead.result.message}</p>
        <p>کد پیگیری: <b dir="ltr">{lead.result.publicCode}</b></p>
        <p className="muted small">این کد را نزد خود نگه دارید. نمایش زمان بازدید قطعی نیست و پس از تماس تأیید می‌شود.</p>
      </div>
    );
  }

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        lead.submit({ ...form, vehicleId: vehicle.id });
      }}
    >
      <div className="field-row">
        <TextField label="نام و نام خانوادگی" id="v-name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={100} required error={lead.fields?.name} />
        <TextField label="موبایل" id="v-phone" type="tel" inputMode="tel" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={form.phone} onChange={(e) => set('phone', e.target.value)} required error={lead.fields?.phone} />
      </div>
      <div className="field-row">
        <TextField label="تاریخ پیشنهادی" id="v-date" type="date" min={today} value={form.preferredDate} onChange={(e) => set('preferredDate', e.target.value)} required error={lead.fields?.preferredDate} hint="زمان پیشنهادی است، نه نوبت قطعی." />
        <SelectField label="بازهٔ زمانی" id="v-slot" value={form.preferredSlot} onChange={(e) => set('preferredSlot', e.target.value)} options={SLOTS} placeholder="انتخاب بازه" error={lead.fields?.preferredSlot} />
      </div>
      <TextareaField label="توضیح (اختیاری)" id="v-msg" rows={3} maxLength={2000} value={form.message} onChange={(e) => set('message', e.target.value)} error={lead.fields?.message} />
      <PrivacyCheckbox checked={form.privacy} onChange={(v) => set('privacy', v)} error={lead.fields?.privacy} />
      <FormMessage error={lead.error} />
      <SubmitButton busy={lead.busy}>ثبت درخواست بازدید</SubmitButton>
    </form>
  );
}

function CallForm({ vehicle }) {
  const lead = useLeadSubmit('call');
  const [form, setForm] = useState({ name: '', phone: '', subject: `درخواست تماس دربارهٔ ${vehicle.title}`, callTime: '', message: '' });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (lead.result) {
    return (
      <div className="form-success card-pad" role="status">
        <h3>درخواست تماس ثبت شد</h3>
        <p>{lead.result.message}</p>
        <p>کد پیگیری: <b dir="ltr">{lead.result.publicCode}</b></p>
      </div>
    );
  }

  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        lead.submit({ ...form, vehicleId: vehicle.id });
      }}
    >
      <div className="field-row">
        <TextField label="نام" id="c-name" value={form.name} onChange={(e) => set('name', e.target.value)} maxLength={100} required error={lead.fields?.name} />
        <TextField label="موبایل" id="c-phone" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} required error={lead.fields?.phone} />
      </div>
      <TextField label="موضوع" id="c-subject" value={form.subject} onChange={(e) => set('subject', e.target.value)} maxLength={120} error={lead.fields?.subject} />
      <TextField label="زمان مناسب تماس (اختیاری)" id="c-time" value={form.callTime} onChange={(e) => set('callTime', e.target.value)} maxLength={60} />
      <TextareaField label="توضیح (اختیاری)" id="c-msg" rows={3} maxLength={2000} value={form.message} onChange={(e) => set('message', e.target.value)} error={lead.fields?.message} />
      <FormMessage error={lead.error} />
      <SubmitButton busy={lead.busy}>ثبت درخواست تماس</SubmitButton>
    </form>
  );
}

export default function VehicleDetail() {
  const { slug } = useParams();
  const { settings } = useSettings();
  const { isFavorite, toggleFavorite, isCompared, toggleCompare } = useStore();
  const [data, setData] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('viewing');
  const [notice, setNotice] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .get(`/vehicles/${slug}`)
      .then((res) => {
        setData(res);
        document.title = `${res.vehicle.title} | ${settings.name}`;
        return api.get(`/vehicles/${slug}/similar`);
      })
      .then((r) => setSimilar(r.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [slug]);

  if (loading) return <div className="container page"><div className="skeleton skeleton-block" /></div>;
  if (error || !data) {
    return (
      <div className="container page">
        <ErrorState message={error || 'این خودرو پیدا نشد.'} onRetry={load} />
        <div className="center"><Link to="/cars" className="btn btn-primary">بازگشت به موجودی</Link></div>
      </div>
    );
  }

  const { vehicle, media, inspection } = data;
  const available = vehicle.lifecycle === 'available';
  const fav = isFavorite(vehicle.slug);
  const cmp = isCompared(vehicle.slug);

  const specs = [
    ['برند', vehicle.brand],
    ['مدل', vehicle.model],
    ['تیپ', vehicle.trim],
    ['سال', yearLabel(vehicle.year, vehicle.yearCalendar)],
    ['کارکرد', mileageLabel(vehicle.mileageKm)],
    ['نوع بدنه', vehicle.bodyType],
    ['رنگ بدنه', vehicle.exteriorColor],
    ['رنگ کابین', vehicle.interiorColor],
    ['گیربکس', vehicle.transmission],
    ['سوخت', vehicle.fuelType],
    ['حجم موتور', vehicle.engineCc ? `${faNum(vehicle.engineCc)} سی‌سی` : null],
    ['انتقال قدرت', vehicle.drivetrain],
    ['شهر', vehicle.city],
    ['محل بازدید', vehicle.viewingLocation],
  ];

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: vehicle.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setNotice('لینک کپی شد.');
        setTimeout(() => setNotice(''), 2500);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="مسیر">
        <Link to="/cars">خودروها</Link>
        <span aria-hidden="true">/</span>
        <span>{vehicle.title}</span>
      </nav>

      <div className="detail-layout">
        <div className="detail-main">
          <Gallery vehicle={vehicle} media={media} />

          <div className="detail-head">
            <div>
              <h1>{vehicle.title}</h1>
              <p className="muted">
                کد {vehicle.code} · {vehicle.brand} {vehicle.model} {vehicle.trim || ''}
              </p>
            </div>
            <div className="detail-badges">
              <StatusBadge status={vehicle.lifecycle} />
              {vehicle.isDemo && <span className="badge badge-demo">نمونه</span>}
            </div>
          </div>

          <div className="detail-price">
            <PriceDisplay vehicle={vehicle} size="lg" />
            <div className="detail-actions">
              <button type="button" className={`btn btn-ghost btn-sm ${fav ? 'is-on' : ''}`} aria-pressed={fav} onClick={() => toggleFavorite(vehicle.slug)}>
                {fav ? '♥ در علاقه‌مندی' : '♡ علاقه‌مندی'}
              </button>
              <button
                type="button"
                className={`btn btn-ghost btn-sm ${cmp ? 'is-on' : ''}`}
                aria-pressed={cmp}
                onClick={() => {
                  const r = toggleCompare(vehicle.slug);
                  if (!r.ok) {
                    setNotice(r.reason);
                    setTimeout(() => setNotice(''), 2500);
                  }
                }}
              >
                ⇄ مقایسه
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={share}>اشتراک لینک</button>
            </div>
          </div>
          {notice && <p className="inline-notice" role="status">{notice}</p>}

          {vehicle.description && <p className="detail-desc">{vehicle.description}</p>}

          <section className="panel">
            <h2>مشخصات</h2>
            <dl className="spec-grid">
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{val(value)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="panel">
            <h2>آپشن‌های تأییدشده</h2>
            {vehicle.options?.length ? (
              <ul className="tag-list">
                {vehicle.options.map((o) => <li key={o} className="tag">{o}</li>)}
              </ul>
            ) : (
              <p className="muted">آپشنی ثبت نشده است.</p>
            )}
          </section>

          <section className="panel">
            <h2>ایرادهای اعلام‌شده</h2>
            {vehicle.defects?.length ? (
              <ul className="defect-list">
                {vehicle.defects.map((d) => <li key={d}>{d}</li>)}
              </ul>
            ) : (
              <p className="muted">ایرادی اعلام نشده است. نبود گزارش به معنای سالم بودن قطعی نیست.</p>
            )}
          </section>

          <section className="panel" id="inspection">
            <h2>کارشناسی</h2>
            {inspection ? (
              <>
                <p className="muted small">
                  تاریخ کارشناسی: {dateLabel(inspection.inspected_at)} · {inspection.inspector_display_name || 'کارشناس'}
                </p>
                <p>{inspection.summary || 'خلاصه‌ای ثبت نشده است.'}</p>
                <dl className="spec-grid tight">
                  {[['شاسی', inspection.chassis], ['فنی', inspection.mechanical], ['تجهیزات', inspection.equipment], ['لاستیک', inspection.tires], ['مدارک', inspection.documents]].map(([l, v]) => (
                    <div key={l}>
                      <dt>{l}</dt>
                      <dd>{val(v)}</dd>
                    </div>
                  ))}
                </dl>
                <InspectionMap bodyParts={inspection.body_parts} />
              </>
            ) : (
              <p className="muted">برای این خودرو گزارش کارشناسی ثبت نشده است.</p>
            )}
          </section>
        </div>

        <aside className="detail-side">
          <div className="panel action-panel">
            <h2>هماهنگی</h2>
            <div className="tabs" role="tablist" aria-label="نوع درخواست">
              <button type="button" role="tab" aria-selected={tab === 'viewing'} className={tab === 'viewing' ? 'is-active' : ''} onClick={() => setTab('viewing')}>بازدید</button>
              <button type="button" role="tab" aria-selected={tab === 'call'} className={tab === 'call' ? 'is-active' : ''} onClick={() => setTab('call')}>تماس</button>
            </div>
            {tab === 'viewing' ? (
              available ? (
                <ViewingForm vehicle={vehicle} />
              ) : (
                <div className="notice notice-warn">
                  <p>این خودرو در وضعیت «{vehicle.lifecycle === 'reserved' ? 'رزرو شده' : vehicle.lifecycle === 'sold' ? 'فروخته شده' : 'خارج شده'}» است.</p>
                  <p className="muted small">برای بازدید این مورد درخواست جدید پذیرفته نمی‌شود. می‌توانید دربارهٔ گزینه‌های مشابه درخواست تماس بدهید.</p>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setTab('call')}>درخواست تماس</button>
                </div>
              )
            ) : (
              <CallForm vehicle={vehicle} />
            )}
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>خودروهای مشابه</h2>
          </div>
          <div className="vehicle-grid">
            {similar.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
          </div>
        </section>
      )}
    </div>
  );
}
