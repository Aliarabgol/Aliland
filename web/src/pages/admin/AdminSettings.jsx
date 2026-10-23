import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../../api.js';
import { ErrorState } from '../../components/States.jsx';

const TEXT_FIELDS = [
  ['name', 'نام نمایشگاه'],
  ['shortDescription', 'توضیح کوتاه'],
  ['city', 'شهر'],
  ['address', 'آدرس'],
  ['phone', 'تلفن'],
  ['whatsapp', 'لینک واتساپ'],
  ['telegram', 'لینک تلگرام'],
  ['instagram', 'لینک اینستاگرام'],
  ['contactEmail', 'ایمیل تماس'],
  ['hours', 'ساعات کار'],
  ['heroTitle', 'تیتر اصلی صفحهٔ خانه'],
  ['heroSubtitle', 'زیرتیتر صفحهٔ خانه'],
];

const FLAGS = [
  ['installments', 'فروش اقساطی'],
  ['tradeIn', 'معاوضه'],
  ['warranty', 'ضمانت'],
  ['testDrive', 'تست رانندگی'],
  ['independentInspection', 'کارشناسی مستقل'],
  ['bookingDeposit', 'پرداخت بیعانه'],
  ['sms', 'پیامک'],
  ['threeD', 'نمایش سه‌بعدی'],
];

export default function AdminSettings() {
  const { user } = useOutletContext();
  const [data, setData] = useState(null);
  const [mode, setMode] = useState('demo');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get('/admin/settings')
      .then((r) => {
        setData(r.settings || {});
        setMode(r.mode || 'demo');
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <div className="skeleton skeleton-block" />;

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const features = data.features || {};
  const setFlag = (k, v) => setData((d) => ({ ...d, features: { ...(d.features || {}), [k]: v } }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      await api.put('/admin/settings', { settings: data, mode });
      setNotice('تنظیمات ذخیره شد.');
    } catch (err) {
      setNotice(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="page-head">
        <div>
          <h1>تنظیمات نمایشگاه</h1>
          <p className="muted">اطلاعات تماس و متن‌ها را با داده‌های واقعی پر کنید.</p>
        </div>
      </header>

      <form className="stack" onSubmit={save}>
        <section className="panel">
          <h2>اطلاعات مجموعه</h2>
          <div className="field-row">
            {TEXT_FIELDS.slice(0, 2).map(([k, label]) => (
              <div className="field" key={k}>
                <label htmlFor={`st-${k}`}>{label}</label>
                <input id={`st-${k}`} className="input" value={data[k] || ''} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="field-row">
            {TEXT_FIELDS.slice(2, 4).map(([k, label]) => (
              <div className="field" key={k}>
                <label htmlFor={`st-${k}`}>{label}</label>
                <input id={`st-${k}`} className="input" value={data[k] || ''} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="field-row">
            {TEXT_FIELDS.slice(4, 7).map(([k, label]) => (
              <div className="field" key={k}>
                <label htmlFor={`st-${k}`}>{label}</label>
                <input id={`st-${k}`} className="input" dir="ltr" value={data[k] || ''} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="field-row">
            {TEXT_FIELDS.slice(7, 10).map(([k, label]) => (
              <div className="field" key={k}>
                <label htmlFor={`st-${k}`}>{label}</label>
                <input id={`st-${k}`} className="input" value={data[k] || ''} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="field-row">
            {TEXT_FIELDS.slice(10).map(([k, label]) => (
              <div className="field" key={k}>
                <label htmlFor={`st-${k}`}>{label}</label>
                <input id={`st-${k}`} className="input" value={data[k] || ''} onChange={(e) => set(k, e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>خدمات اختیاری</h2>
          <p className="muted small">پیش‌فرض همه خاموش است. فقط با داده و تنظیم واقعی فعال شوند.</p>
          <div className="flag-grid">
            {FLAGS.map(([k, label]) => (
              <label key={k} className="checkbox-label">
                <input type="checkbox" checked={!!features[k]} onChange={(e) => setFlag(k, e.target.checked)} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>حالت اجرا</h2>
          <div className="field">
            <label htmlFor="st-mode">حالت</label>
            <select id="st-mode" className="input select" value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="demo">نمونه (demo)</option>
              <option value="live">واقعی (live)</option>
            </select>
          </div>
          <p className="muted small">تغییر به live فقط پس از تکمیل اطلاعات و داده‌های واقعی انجام شود. داده‌های نمونه وارد آمار واقعی نمی‌شوند.</p>
        </section>

        {notice && <div className="form-message form-success" role="status">{notice}</div>}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={busy || user.role !== 'admin'}>
            {busy ? 'در حال ذخیره…' : 'ذخیره تنظیمات'}
          </button>
          {user.role !== 'admin' && <span className="muted small">فقط مدیر می‌تواند تنظیمات را ذخیره کند.</span>}
        </div>
      </form>
    </div>
  );
}
