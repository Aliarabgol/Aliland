import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal } from '../lib/motion.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import { Icon, SERVICE_ICON } from '../components/Icons.jsx';

const TONE_ART = {
  ivory: { tone: '#20293a', accent: '#415CF0' },
  ink: { tone: '#0f141d', accent: '#BE8459' },
  steel: { tone: '#2a323d', accent: '#73808E' },
  bronze: { tone: '#2b2018', accent: '#BE8459' },
};

export default function Services() {
  const { t, bi, num, lang } = useI18n();
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then((data) => setServices(data.items || [])).catch(() => {});
  }, []);

  return (
    <>
      <section className="page-hero" data-nav-tone="light">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('svc.overview')}</span>
          </nav>
          <h1>{t('svc.overview')}</h1>
          <p>
            {lang === 'fa'
              ? 'هر خدمت در علی‌لند برای یک لحظه مشخص از تصمیم ساخته شده است: پیش از خرید، هنگام فروش، یا وقتی باید بین دو گزینه انتخاب کرد. هیچ‌کدام به‌تنهایی ضامن نتیجه نیستند — کارشان روشن‌کردن مسیر است.'
              : 'Each AliLand service is built for one specific moment of the decision: before buying, while selling, or when two options must be compared. None of them guarantees an outcome — their job is to make the path clear.'}
          </p>
          <p className="demo-note">
            <Icon name="info" size={14} />
            <span>{t('svc.demoNote')}</span>
          </p>
        </div>
      </section>

      <div className="shell" style={{ paddingBlock: 'clamp(28px,4vw,54px) clamp(50px,8vw,90px)' }}>
        <div className="grid-2">
          {services.map((service, index) => {
            const art = TONE_ART[service.tone] || TONE_ART.ivory;
            return (
              <Reveal key={service.slug} delay={Math.min(index * 0.04, 0.25)}>
                <Link
                  className="card"
                  to={`/services/${service.slug}`}
                  style={{ display: 'grid', gap: 14, height: '100%', overflow: 'hidden', padding: 0 }}
                >
                  <div style={{ aspectRatio: '16/7', overflow: 'hidden', background: '#0b0e15' }}>
                    <VehicleArt tone={art.tone} accent={art.accent} angle={index % 2 === 0 ? 'quarter' : 'cabin'} />
                  </div>
                  <div style={{ padding: '0 clamp(18px,2.4vw,28px) clamp(20px,2.6vw,28px)' }}>
                    <div className="flex-between">
                      <span className="label num">{service.number}</span>
                      <Icon name={SERVICE_ICON[service.slug] || 'sparkles'} size={17} style={{ opacity: 0.45 }} />
                    </div>
                    <h2 className="h3 mt-1">{bi(service, 'title')}</h2>
                    <p className="small muted mt-1">{bi(service, 'kicker')}</p>
                    <p className="small body-soft mt-2" style={{ lineHeight: 1.85 }}>
                      {bi(service, 'intro').slice(0, 150)}
                      {bi(service, 'intro').length > 150 ? '…' : ''}
                    </p>
                    <span className="link-arrow mt-3">
                      {t('act.details')}
                      <Icon name="arrowEnd" size={14} className="rtl-flip" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
        <p className="small muted mt-4">
          {lang === 'fa'
            ? `${num(services.length)} صفحه خدمات — همه در حالت نمایشی و بدون ارائه خدمت واقعی.`
            : `${num(services.length)} service pages — all in demo mode with no real service delivered.`}
        </p>
      </div>
    </>
  );
}
