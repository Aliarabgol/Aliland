import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal, StaggerText } from '../lib/motion.jsx';
import { Icon } from '../components/Icons.jsx';

const GROUPS = [
  { key: 'dealer', icon: 'building' },
  { key: 'seller', icon: 'users' },
  { key: 'broker', icon: 'route' },
  { key: 'inspector', icon: 'shield' },
  { key: 'photographer', icon: 'camera' },
  { key: 'service', icon: 'wrench' },
  { key: 'marketing', icon: 'sparkles' },
];

const MODELS = ['فهرست مشترک', 'ارجاع کار', 'پروژه‌ای', 'نمایش برند'];
const MODELS_EN = ['Shared catalogue', 'Referral', 'Project-based', 'Brand placement'];
const CONTACT_METHODS = [['email', 'ایمیل'], ['phone', 'تلفن'], ['messenger', 'پیام‌رسان']];

const STEPS = ['partner.step1', 'partner.step2', 'partner.step3', 'partner.step4', 'partner.step5'];

export default function Partnership() {
  const { t, lang, num } = useI18n();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    applicantType: '',
    name: '',
    company: '',
    city: '',
    specialization: '',
    experience: '',
    serviceArea: '',
    partnershipModel: '',
    description: '',
    portfolioUrl: '',
    contactMethod: 'email',
    notes: '',
    consent: false,
  });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = (index) => {
    const next = {};
    if (index === 0 && !form.applicantType) next.applicantType = t('form.required');
    if (index === 1) {
      if (form.name.trim().length < 2) next.name = t('form.required');
      if (!form.city.trim()) next.city = t('form.required');
    }
    if (index === 2 && !form.specialization.trim()) next.specialization = t('form.required');
    if (index === 4 && !form.consent) next.consent = t('partner.consentRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate(step)) return;
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  };

  const submit = async () => {
    if (!validate(4)) return;
    setBusy(true);
    try {
      await api.post('/partner-applications', form);
      setSent(true);
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
            <p className="small muted">{t('partner.noSensitive')}</p>
            <Link className="btn btn--primary" to="/">
              {t('nf.home')}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="service-hero" data-nav-tone="dark">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')} style={{ color: 'rgba(243,242,238,0.6)' }}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('partner.title')}</span>
          </nav>
          <div className="mt-3" style={{ maxWidth: '64ch' }}>
            <span className="kicker">{t('home.partner.kicker')}</span>
            <StaggerText as="h1" text={t('partner.title')} className="mt-2" />
            <p className="lead mt-2" style={{ color: 'rgba(243,242,238,0.72)' }}>
              {t('partner.desc')}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="shell">
          <span className="kicker">{t('partner.groups')}</span>
          <div className="partner-grid mt-3" style={{ marginBlockEnd: 8 }}>
            {GROUPS.map((group, index) => (
              <Reveal key={group.key} delay={index * 0.04}>
                <div
                  className="partner-card"
                  style={{ background: 'var(--surface-raised)', borderColor: 'var(--hairline)' }}
                >
                  <span className="partner-card__icon" style={{ background: 'var(--bronze-wash)', color: '#8a5a33' }}>
                    <Icon name={group.icon} size={17} />
                  </span>
                  <h3 style={{ color: 'var(--ink)' }}>{t(`partner.type.${group.key}`)}</h3>
                  <p style={{ color: 'var(--on-surface-soft)' }}>
                    {lang === 'fa'
                      ? {
                          dealer: 'فهرست مشترک موجودی و استاندارد ارائه اطلاعات خودرو.',
                          seller: 'مسیر ساده‌تر برای ثبت و توصیف دقیق خودروی شخصی.',
                          broker: 'چارچوب شفاف برای معرفی و مقایسه گزینه‌ها.',
                          inspector: 'ارجاع کارشناسی و ساختار گزارش قابل خواندن.',
                          photographer: 'تولید تصاویر و محتوای خودرو با حقوق مشخص.',
                          service: 'دسترسی به مشتریانی که در مرحله تصمیم هستند.',
                          marketing: 'همکاری در محصول، داده و تجربه کاربری.',
                        }[group.key]
                      : {
                          dealer: 'Shared inventory listings and a standard for presenting car data.',
                          seller: 'A simpler path to list and describe a private car accurately.',
                          broker: 'A transparent framework for presenting and comparing options.',
                          inspector: 'Inspection referrals and a readable report structure.',
                          photographer: 'Vehicle imagery and content with clear rights.',
                          service: 'Reach owners who are at the decision stage.',
                          marketing: 'Collaboration on product, data and experience.',
                        }[group.key]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ivory2">
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
                <span className="tag tag--demo">{t('partner.formTitle')}</span>
              </div>

              {step === 0 && (
                <div>
                  <h3 className="h3" style={{ marginBlockEnd: 12 }}>{t('partner.step1')}</h3>
                  <div className="row" style={{ gap: 8 }}>
                    {GROUPS.map((group) => (
                      <button
                        type="button"
                        className="chip"
                        key={group.key}
                        aria-pressed={form.applicantType === group.key}
                        onClick={() => set('applicantType', group.key)}
                      >
                        <Icon name={group.icon} size={14} />
                        {t(`partner.type.${group.key}`)}
                      </button>
                    ))}
                  </div>
                  {errors.applicantType && <span className="field-error">{errors.applicantType}</span>}
                </div>
              )}

              {step === 1 && (
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="p-name">{t('partner.name')} *</label>
                    <input
                      id="p-name"
                      className="input"
                      value={form.name}
                      aria-invalid={Boolean(errors.name)}
                      onChange={(event) => set('name', event.target.value)}
                    />
                    {errors.name && <span className="field-error">{errors.name}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="p-company">{t('partner.company')}</label>
                    <input
                      id="p-company"
                      className="input"
                      value={form.company}
                      onChange={(event) => set('company', event.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="p-city">{t('partner.city')} *</label>
                    <input
                      id="p-city"
                      className="input"
                      value={form.city}
                      aria-invalid={Boolean(errors.city)}
                      onChange={(event) => set('city', event.target.value)}
                    />
                    {errors.city && <span className="field-error">{errors.city}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="p-area">{t('partner.serviceArea')}</label>
                    <input
                      id="p-area"
                      className="input"
                      value={form.serviceArea}
                      onChange={(event) => set('serviceArea', event.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="p-spec">{t('partner.specialization')} *</label>
                    <input
                      id="p-spec"
                      className="input"
                      value={form.specialization}
                      aria-invalid={Boolean(errors.specialization)}
                      onChange={(event) => set('specialization', event.target.value)}
                    />
                    {errors.specialization && <span className="field-error">{errors.specialization}</span>}
                  </div>
                  <div className="field">
                    <label htmlFor="p-exp">{t('partner.experience')}</label>
                    <input
                      id="p-exp"
                      className="input num"
                      inputMode="numeric"
                      dir="ltr"
                      value={form.experience}
                      onChange={(event) => set('experience', event.target.value.replace(/[^\d]/g, ''))}
                    />
                  </div>
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="p-portfolio">{t('partner.portfolio')}</label>
                    <input
                      id="p-portfolio"
                      className="input"
                      dir="ltr"
                      placeholder="https://"
                      value={form.portfolioUrl}
                      onChange={(event) => set('portfolioUrl', event.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="form-grid">
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <span className="field-label">{t('partner.model')}</span>
                    <div className="row" style={{ gap: 8 }}>
                      {(lang === 'fa' ? MODELS : MODELS_EN).map((model) => (
                        <button
                          type="button"
                          className="chip"
                          key={model}
                          aria-pressed={form.partnershipModel === model}
                          onClick={() => set('partnershipModel', model)}
                        >
                          {model}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="p-contact">{t('partner.contactMethod')}</label>
                    <select
                      id="p-contact"
                      className="select"
                      value={form.contactMethod}
                      onChange={(event) => set('contactMethod', event.target.value)}
                    >
                      {CONTACT_METHODS.map(([value, label]) => (
                        <option value={value} key={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="p-desc">{t('partner.description')}</label>
                    <textarea
                      id="p-desc"
                      className="textarea"
                      value={form.description}
                      onChange={(event) => set('description', event.target.value)}
                    />
                  </div>
                  <div className="field" style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="p-notes">{t('partner.extra')}</label>
                    <textarea
                      id="p-notes"
                      className="textarea"
                      style={{ minHeight: 80 }}
                      value={form.notes}
                      onChange={(event) => set('notes', event.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <>
                  <div className="review-grid">
                    {[
                      [t('partner.step1'), form.applicantType ? t(`partner.type.${form.applicantType}`) : '—'],
                      [t('partner.name'), form.name || '—'],
                      [t('partner.company'), form.company || '—'],
                      [t('partner.city'), form.city || '—'],
                      [t('partner.specialization'), form.specialization || '—'],
                      [t('partner.experience'), form.experience ? num(form.experience) : '—'],
                      [t('partner.serviceArea'), form.serviceArea || '—'],
                      [t('partner.model'), form.partnershipModel || '—'],
                      [t('partner.portfolio'), form.portfolioUrl || '—'],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <span>{label}</span>
                        <span>{value}</span>
                      </div>
                    ))}
                  </div>

                  <label className="check">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      aria-invalid={Boolean(errors.consent)}
                      onChange={(event) => set('consent', event.target.checked)}
                    />
                    <span>{t('partner.consent')}</span>
                  </label>
                  {errors.consent && <span className="field-error">{errors.consent}</span>}
                  <p className="small muted">{t('partner.noSensitive')}</p>
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
          </div>
        </div>
      </section>
    </>
  );
}
