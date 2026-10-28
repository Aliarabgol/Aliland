import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Contact() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({ name: '', contact: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = t('form.required');
    if (form.contact.trim().length < 3) next.contact = t('form.required');
    if (form.message.trim().length < 4) next.message = t('form.required');
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await api.post('/inquiries', { kind: 'contact', ...form });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('contact.title')}</span>
          </nav>
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.desc')}</p>
          <div className="row">
            <span className="tag tag--demo">
              <Icon name="info" size={13} />
              {lang === 'fa' ? 'بدون شماره تماس واقعی' : 'no real phone number'}
            </span>
            <Link className="tag tag--demo" to="/faq">
              <Icon name="doc" size={13} />
              {t('nav.faq')}
            </Link>
          </div>
        </div>
      </section>

      <div className="shell" style={{ paddingBlock: 'clamp(28px,4vw,54px) clamp(50px,8vw,90px)' }}>
        <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,64px)' }}>
          <div>
            {sent ? (
              <div className="success-panel">
                <span className="success-panel__icon">
                  <Icon name="check" size={20} />
                </span>
                <h2 className="h2">{t('form.successTitle')}</h2>
                <p className="body-soft">{t('form.successBody')}</p>
                <button type="button" className="btn btn--ink btn--sm" onClick={() => setSent(false)}>
                  {t('form.another')}
                </button>
              </div>
            ) : (
              <form className="flow-card" onSubmit={submit} noValidate>
                <h2 className="h3">{t('svc.cta')}</h2>
                <div className="form-grid form-grid--2">
                  <div className="field">
                    <label htmlFor="c-name">{t('contact.name')} *</label>
                    <input
                      id="c-name"
                      className="input"
                      value={form.name}
                      aria-invalid={Boolean(errors.name)}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="c-contact">{t('contact.email')} *</label>
                    <input
                      id="c-contact"
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
                  <label htmlFor="c-subject">{t('contact.subject')}</label>
                  <input
                    id="c-subject"
                    className="input"
                    value={form.subject}
                    onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="c-message">{t('contact.message')} *</label>
                  <textarea
                    id="c-message"
                    className="textarea"
                    value={form.message}
                    aria-invalid={Boolean(errors.message)}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                  />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>
                <p className="small muted">{t('form.simulated')}</p>
                <p className="small muted">{t('partner.noSensitive')}</p>
                <button className="btn btn--primary" type="submit" disabled={busy}>
                  {busy ? t('act.loading') : t('form.confirm')}
                </button>
              </form>
            )}
          </div>

          <aside className="stack">
            <div className="card">
              <h3 className="h3">{lang === 'fa' ? 'چرا شماره تماس نیست؟' : 'Why no phone number?'}</h3>
              <p className="small body-soft mt-1" style={{ lineHeight: 1.95 }}>
                {lang === 'fa'
                  ? 'صاحب این پروژه مشخصاً خواسته است که شماره واقعی او در هیچ‌کجای این نسخه — نه در رابط کاربری، نه در داده نمونه و نه در ترجمه‌ها — منتشر نشود. به‌جای ساختن یک شماره جعلی، هیچ شماره‌ای نمایش داده نمی‌شود.'
                  : 'The owner asked specifically that his real number is not published anywhere in this build — not in the interface, not in the seed data, not in the translations. Rather than invent a fake number, none is shown.'}
              </p>
            </div>
            <div className="card">
              <h3 className="h3">{lang === 'fa' ? 'مسیرهای سریع' : 'Quick routes'}</h3>
              <div className="aside-links mt-1">
                <Link to="/faq">
                  <span>{t('nav.faq')}</span>
                  <Icon name="chevronEnd" size={13} className="rtl-flip" />
                </Link>
                <Link to="/partnership">
                  <span>{t('nav.partnership')}</span>
                  <Icon name="chevronEnd" size={13} className="rtl-flip" />
                </Link>
                <Link to="/privacy">
                  <span>{t('nav.privacy')}</span>
                  <Icon name="chevronEnd" size={13} className="rtl-flip" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
