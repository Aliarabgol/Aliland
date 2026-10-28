import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Reveal, StaggerText, Parallax } from '../lib/motion.jsx';
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

export function PartnerTeaser() {
  const { t, lang } = useI18n();
  const { section, visible } = useSite();
  if (!visible('partnership')) return null;
  const data = section('partnership');

  return (
    <section className="section">
      <div className="shell">
        <Reveal>
          <div className="partner-band">
            <div style={{ position: 'relative', zIndex: 1, display: 'grid', gap: 20, maxWidth: '64ch' }}>
              <span className="kicker" style={{ color: 'var(--bronze-soft)' }}>
                {t('home.partner.kicker')}
              </span>
              <h2 className="display-2" style={{ color: '#f6ecdf' }}>
                {(lang === 'fa' ? data?.title_fa : data?.title_en) || t('partner.title')}
              </h2>
              <p style={{ color: 'rgba(246,236,223,0.75)', fontSize: 'var(--fs-lead)', lineHeight: 1.95 }}>
                {(lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || ''}
              </p>
              <div className="partner-groups">
                {GROUPS.map((group) => (
                  <span key={group.key}>{t(`partner.type.${group.key}`)}</span>
                ))}
              </div>
              <div className="row mt-2">
                <Link className="btn btn--bronze btn--lg" to="/partnership">
                  {t('partner.formTitle')}
                  <Icon name="arrowEnd" size={16} className="rtl-flip" />
                </Link>
                <Link className="btn btn--onDark" to="/partnership" style={{ borderColor: 'rgba(246,236,223,0.4)', color: '#f6ecdf' }}>
                  {t('partner.groups')}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FounderTeaser() {
  const { t, lang } = useI18n();
  const { section, visible } = useSite();
  if (!visible('founder')) return null;
  const data = section('founder');

  return (
    <section className="section section--ivory2">
      <div className="shell">
        <div className="founder-split">
          <Parallax speed={22}>
            <div className="portrait-frame">
              <svg viewBox="0 0 400 500" style={{ width: '100%', height: '100%' }} aria-hidden="true">
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2b3445" />
                    <stop offset="100%" stopColor="#0b0e14" />
                  </linearGradient>
                  <linearGradient id="pl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#be8459" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#be8459" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="400" height="500" fill="url(#pg)" />
                <circle cx="200" cy="205" r="86" fill="url(#pl)" opacity="0.22" />
                <path d="M96 500c0-72 46-116 104-116s104 44 104 116Z" fill="#161d29" />
                <circle cx="200" cy="212" r="62" fill="#1d2533" />
                <path d="M200 150a62 62 0 0 1 0 124" fill="#232c3c" opacity="0.6" />
                <rect x="0" y="0" width="400" height="500" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="26" />
                <text x="200" y="118" textAnchor="middle" fill="#be8459" fontSize="13" letterSpacing="6" fontFamily="Inter, sans-serif">ALILAND</text>
              </svg>
              <span className="portrait-frame__label">{t('founder.placeholder')}</span>
            </div>
          </Parallax>

          <div>
            <span className="kicker">{t('home.founder.kicker')}</span>
            <StaggerText
              as="h2"
              className="display-2 mt-2"
              text={(lang === 'fa' ? data?.title_fa : data?.title_en) || t('founder.title')}
            />
            <span className="quote-mark mt-3">“</span>
            <p className="lead mt-1">
              {lang === 'fa'
                ? 'علی‌لند از یک تجربه ساده شروع شد: وقتی خودرو می‌خریم، بیشتر از هر چیز کمبود اطلاعات آزارمان می‌دهد — نه کمبود گزینه.'
                : 'AliLand began with a simple observation: when we buy a car, what hurts is missing information far more than missing options.'}
            </p>
            <p className="body-soft mt-2">
              {(lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || ''}
            </p>
            <div className="row mt-3">
              <Link className="btn btn--ink" to="/founder">
                {t('nav.founder')}
                <Icon name="arrowEnd" size={15} className="rtl-flip" />
              </Link>
              <Link className="link-arrow" to="/about">
                {t('nav.about')}
              </Link>
            </div>
            <p className="small muted mt-3" style={{ maxWidth: '52ch', lineHeight: 1.9 }}>
              {t('founder.factNote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
