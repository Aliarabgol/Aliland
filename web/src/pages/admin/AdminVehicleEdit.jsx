import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import { ErrorState } from '../../components/States.jsx';

const EMPTY = {
  title: '', brand: '', model: '', trim: '', year: '', yearCalendar: 'jalali', mileageKm: '',
  bodyType: '', fuelType: '', transmission: '', exteriorColor: '', interiorColor: '', engineCc: '',
  drivetrain: '', city: '', viewingLocation: '', price: '', priceMode: 'fixed', priceConfirmedAt: '',
  description: '', options: '', defects: '', cover: '', featured: false,
  lifecycle: 'available', publication: 'draft', seoTitle: '', seoDescription: '',
};

const PUBLICATION = [
  { value: 'draft', label: 'پیش‌نویس' },
  { value: 'pending_review', label: 'در انتظار بازبینی' },
  { value: 'published', label: 'منتشرشده' },
  { value: 'archived', label: 'بایگانی' },
];
const LIFECYCLE = [
  { value: 'available', label: 'موجود' },
  { value: 'reserved', label: 'رزرو شده' },
  { value: 'sold', label: 'فروخته شده' },
  { value: 'withdrawn', label: 'خارج شده' },
];

function toForm(v) {
  return {
    ...EMPTY,
    title: v.title || '', brand: v.brand || '', model: v.model || '', trim: v.trim || '',
    year: v.year_value || '', yearCalendar: v.year_calendar || 'jalali', mileageKm: v.mileage_km ?? '',
    bodyType: v.body_type || '', fuelType: v.fuel_type || '', transmission: v.transmission || '',
    exteriorColor: v.exterior_color || '', interiorColor: v.interior_color || '', engineCc: v.engine_cc ?? '',
    drivetrain: v.drivetrain || '', city: v.city || '', viewingLocation: v.public_viewing_location || '',
    price: v.price_toman ?? '', priceMode: v.price_mode || 'fixed',
    priceConfirmedAt: v.price_confirmed_at ? String(v.price_confirmed_at).slice(0, 10) : '',
    description: v.description || '',
    options: (v.verified_options || []).join('\n'), defects: (v.disclosed_defects || []).join('\n'),
    cover: v.cover_media_url || '', featured: !!v.featured,
    lifecycle: v.lifecycle_status || 'available', publication: v.publication_status || 'draft',
    seoTitle: v.seo_title || '', seoDescription: v.seo_description || '',
  };
}

// Module-level field components keep their identity across renders so inputs never lose focus.
function FieldText({ label, name, form, set, type = 'text', ...rest }) {
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <input id={`f-${name}`} className="input" type={type} value={form[name]} onChange={(e) => set(name, e.target.value)} {...rest} />
    </div>
  );
}

function FieldSelect({ label, name, form, set, options }) {
  return (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <select id={`f-${name}`} className="input select" value={form[name]} onChange={(e) => set(name, e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export default function AdminVehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const isNew = !id;
  const [form, setForm] = useState(EMPTY);
  const [priv, setPriv] = useState({ collaborationType: '', ownerName: '', ownerPhone: '', purchasePrice: '', commission: '', internalNote: '', privateFileUrl: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/vehicles/${id}`)
      .then((r) => {
        setForm(toForm(r.vehicle));
        if (r.private) {
          setPriv({
            collaborationType: r.private.collaboration_type || '',
            ownerName: r.private.owner_name || '',
            ownerPhone: r.private.owner_phone || '',
            purchasePrice: r.private.purchase_price ?? '',
            commission: r.private.commission ?? '',
            internalNote: r.private.internal_note || '',
            privateFileUrl: r.private.private_file_url || '',
          });
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setP = (k, v) => setPriv((p) => ({ ...p, [k]: v }));

  const payload = () => ({
    ...form,
    options: form.options.split('\n').map((s) => s.trim()).filter(Boolean),
    defects: form.defects.split('\n').map((s) => s.trim()).filter(Boolean),
    price: form.priceMode === 'on_request' ? null : form.price,
  });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (isNew) {
        const r = await api.post('/admin/vehicles', payload());
        navigate(`/admin/vehicles/${r.vehicle.id}`);
      } else {
        await api.put(`/admin/vehicles/${id}`, payload());
        if (user.role === 'admin') {
          await api.put(`/admin/vehicles/${id}/private`, priv);
        }
        setNotice('تغییرات ذخیره شد.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="skeleton skeleton-block" />;
  if (error && !form.title && !isNew) return <ErrorState message={error} />;

  return (
    <div className="admin-page">
      <header className="page-head">
        <div>
          <h1>{isNew ? 'افزودن خودرو' : 'ویرایش خودرو'}</h1>
          <p className="muted">وضعیت موجودی و وضعیت انتشار دو مفهوم مستقل‌اند.</p>
        </div>
        <Link to="/admin/vehicles" className="btn btn-ghost">بازگشت</Link>
      </header>

      <form className="stack" onSubmit={save}>
        <section className="panel">
          <h2>اطلاعات اصلی</h2>
          <div className="field-row">
            <FieldText label="عنوان" name="title" form={form} set={set} required maxLength={120} />
            <FieldText label="برند" name="brand" form={form} set={set} required maxLength={60} />
          </div>
          <div className="field-row">
            <FieldText label="مدل" name="model" form={form} set={set} required maxLength={60} />
            <FieldText label="تیپ" name="trim" form={form} set={set} maxLength={60} />
          </div>
          <div className="field-row">
            <FieldText label="سال" name="year" form={form} set={set} inputMode="numeric" />
            <FieldSelect label="تقویم" name="yearCalendar" form={form} set={set} options={[{ value: 'jalali', label: 'شمسی' }, { value: 'gregorian', label: 'میلادی' }]} />
          </div>
          <div className="field-row">
            <FieldText label="کارکرد (کیلومتر)" name="mileageKm" form={form} set={set} inputMode="numeric" />
            <FieldText label="شهر" name="city" form={form} set={set} />
          </div>
          <FieldText label="محل بازدید" name="viewingLocation" form={form} set={set} />
        </section>

        <section className="panel">
          <h2>مشخصات</h2>
          <div className="field-row">
            <FieldText label="نوع بدنه" name="bodyType" form={form} set={set} />
            <FieldText label="گیربکس" name="transmission" form={form} set={set} />
          </div>
          <div className="field-row">
            <FieldText label="سوخت" name="fuelType" form={form} set={set} />
            <FieldText label="رنگ بدنه" name="exteriorColor" form={form} set={set} />
          </div>
          <div className="field-row">
            <FieldText label="رنگ کابین" name="interiorColor" form={form} set={set} />
            <FieldText label="حجم موتور (سی‌سی)" name="engineCc" form={form} set={set} inputMode="numeric" />
          </div>
          <FieldText label="انتقال قدرت" name="drivetrain" form={form} set={set} />
        </section>

        <section className="panel">
          <h2>قیمت و وضعیت</h2>
          <div className="field-row">
            <FieldSelect label="حالت قیمت" name="priceMode" form={form} set={set} options={[{ value: 'fixed', label: 'مشخص' }, { value: 'on_request', label: 'تماس برای قیمت' }]} />
            {form.priceMode === 'fixed' && <FieldText label="قیمت (تومان)" name="price" form={form} set={set} inputMode="numeric" />}
            <FieldText label="تاریخ تأیید قیمت" name="priceConfirmedAt" form={form} set={set} type="date" />
          </div>
          <div className="field-row">
            <FieldSelect label="وضعیت موجودی" name="lifecycle" form={form} set={set} options={LIFECYCLE} />
            <FieldSelect label="وضعیت انتشار" name="publication" form={form} set={set} options={PUBLICATION} />
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
            <span>نمایش به‌عنوان خودروی ویژه</span>
          </label>
        </section>

        <section className="panel">
          <h2>توضیحات و آپشن‌ها</h2>
          <div className="field">
            <label htmlFor="f-description">توضیحات</label>
            <textarea id="f-description" className="input textarea" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="f-options">آپشن‌ها (هر خط یک مورد)</label>
              <textarea id="f-options" className="input textarea" rows={4} value={form.options} onChange={(e) => set('options', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="f-defects">ایرادهای اعلام‌شده (هر خط یک مورد)</label>
              <textarea id="f-defects" className="input textarea" rows={4} value={form.defects} onChange={(e) => set('defects', e.target.value)} />
            </div>
          </div>
          <FieldText label="نشانی تصویر کاور (اختیاری)" name="cover" form={form} set={set} dir="ltr" />
          <div className="field-row">
            <FieldText label="عنوان SEO" name="seoTitle" form={form} set={set} maxLength={70} />
            <FieldText label="توضیح SEO" name="seoDescription" form={form} set={set} maxLength={160} />
          </div>
        </section>

        {!isNew && user.role === 'admin' && (
          <section className="panel private-panel">
            <h2>اطلاعات خصوصی (فقط مدیر)</h2>
            <p className="muted small">این بخش هرگز در سایت عمومی نمایش داده نمی‌شود.</p>
            <div className="field-row">
              <div className="field">
                <label htmlFor="p-collab">نوع همکاری</label>
                <input id="p-collab" className="input" value={priv.collaborationType} onChange={(e) => setP('collaborationType', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-owner">نام مالک</label>
                <input id="p-owner" className="input" value={priv.ownerName} onChange={(e) => setP('ownerName', e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="p-phone">تلفن مالک</label>
                <input id="p-phone" className="input" dir="ltr" value={priv.ownerPhone} onChange={(e) => setP('ownerPhone', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-buy">قیمت خرید</label>
                <input id="p-buy" className="input" inputMode="numeric" value={priv.purchasePrice} onChange={(e) => setP('purchasePrice', e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="p-comm">کمیسیون</label>
                <input id="p-comm" className="input" inputMode="numeric" value={priv.commission} onChange={(e) => setP('commission', e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="p-note">یادداشت داخلی</label>
              <textarea id="p-note" className="input textarea" rows={3} value={priv.internalNote} onChange={(e) => setP('internalNote', e.target.value)} />
            </div>
          </section>
        )}

        {error && <div className="form-message form-error" role="alert">{error}</div>}
        {notice && <div className="form-message form-success" role="status">{notice}</div>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'در حال ذخیره…' : 'ذخیره'}</button>
          <Link to="/admin/vehicles" className="btn btn-ghost">انصراف</Link>
        </div>
      </form>
    </div>
  );
}
