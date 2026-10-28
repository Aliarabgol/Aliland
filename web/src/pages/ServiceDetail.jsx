import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal, StaggerText } from '../lib/motion.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import FinderQuiz from '../components/FinderQuiz.jsx';
import { Accordion } from '../components/ui.jsx';
import { Icon, SERVICE_ICON } from '../components/Icons.jsx';
import {
  InstalmentDemo,
  TradeInDemo,
  InspectionDemo,
  ValuationDemo,
  DemoRequestForm,
} from '../components/demos.jsx';

const TONE_ART = {
  ivory: { tone: '#1c2432', accent: '#415CF0' },
  ink: { tone: '#0d1119', accent: '#BE8459' },
  steel: { tone: '#28303b', accent: '#73808E' },
  bronze: { tone: '#2a1f17', accent: '#BE8459' },
};

function LinkPanel({ to, title, body, label }) {
  return (
    <div className="flow-card">
      <h3 className="h3">{title}</h3>
      <p className="small body-soft">{body}</p>
      <Link className="btn btn--primary" to={to}>
        {label}
        <Icon name="arrowEnd" size={15} className="rtl-flip" />
      </Link>
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { t, bi, lang } = useI18n();
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setMissing(false);
    api
      .get(`/services/${slug}`)
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setMissing(true));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) {
    return (
      <section className="page-hero">
        <div className="shell">
          <h1>{t('nf.title')}</h1>
          <Link className="btn btn--ink mt-2" to="/services">
            {t('svc.overview')}
          </Link>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <div className="shell" style={{ paddingBlock: 'calc(var(--header-h) + 40px)' }}>
        <div className="skeleton" style={{ height: 380 }} />
      </div>
    );
  }

  const { service, related } = data;
  const art = TONE_ART[service.tone] || TONE_ART.ivory;
  const faqItems = (service.faq || []).map((item) => ({
    question: lang === 'fa' ? item.q_fa : item.q_en,
    answer: lang === 'fa' ? item.a_fa : item.a_en,
  }));

  const demo = () => {
    switch (service.slug) {
      case 'finder':
        return <FinderQuiz />;
      case 'installment':
        return <InstalmentDemo />;
      case 'trade-in':
        return <TradeInDemo />;
      case 'inspection':
        return <InspectionDemo />;
      case 'valuation':
        return <ValuationDemo />;
      case 'visit':
        return <DemoRequestForm kind="visit" />;
      case 'consultation':
        return <DemoRequestForm kind="consultation" />;
      case 'sell':
        return (
          <LinkPanel
            to="/sell"
            title={t('sell.title')}
            body={lang === 'fa'
              ? 'فرم چندمرحله‌ای فروش، مشخصات و وضعیت خودرو را دقیق ثبت می‌کند و پیش‌نویس را در مرورگر نگه می‌دارد.'
              : 'The multi-step sell form records the spec and condition precisely and keeps your draft in the browser.'}
            label={t('sell.title')}
          />
        );
      case 'buy':
        return (
          <LinkPanel
            to="/vehicles"
            title={t('cat.page.title')}
            body={lang === 'fa'
              ? 'فهرست را با فیلترهای دسته، بدنه، سوخت و بودجه محدود کنید و سپس دو یا سه گزینه را مقایسه کنید.'
              : 'Narrow the catalogue with category, body, fuel and budget filters, then compare two or three options.'}
            label={t('nav.allVehicles')}
          />
        );
      default:
        return (
          <LinkPanel
            to="/journal"
            title={t('journal.title')}
            body={t('journal.desc')}
            label={t('act.viewAll')}
          />
        );
    }
  };

  return (
    <>
      <section className="service-hero" data-nav-tone="dark">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')} style={{ color: 'rgba(243,242,238,0.6)' }}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <Link to="/services">{t('svc.overview')}</Link>
            <span className="sep">/</span>
            <span>{bi(service, 'title')}</span>
          </nav>

          <div className="service-hero__grid mt-3">
            <div>
              <span className="kicker">
                {service.number} — {bi(service, 'kicker')}
              </span>
              <StaggerText as="h1" text={bi(service, 'title')} className="mt-2" />
              <p className="lead mt-2" style={{ color: 'rgba(243,242,238,0.72)' }}>
                {bi(service, 'intro')}
              </p>
              <div className="row mt-3">
                <a className="btn btn--primary" href="#demo">
                  {t('svc.demo')}
                  <Icon name={SERVICE_ICON[service.slug] || 'sparkles'} size={16} />
                </a>
                <Link className="btn btn--onDark" to={service.cta_href || '/contact'}>
                  {t('svc.cta')}
                </Link>
              </div>
            </div>
            <div className="service-hero__art">
              <VehicleArt tone={art.tone} accent={art.accent} angle="quarter" />
            </div>
          </div>
        </div>
      </section>

      <div className="shell">
        <div className="service-body">
          <div className="prose">
            <h2>{t('svc.problem')}</h2>
            <p>{bi(service, 'problem')}</p>
            <h2>{t('svc.value')}</h2>
            <p>{bi(service, 'value')}</p>

            <h2>{t('svc.process')}</h2>
            <div className="step-list">
              {(service.steps || []).map((step, index) => (
                <Reveal className="step-card" key={step.title_fa} delay={index * 0.04}>
                  <span className="step-card__n">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{lang === 'fa' ? step.title_fa : step.title_en}</h3>
                    <p>{lang === 'fa' ? step.body_fa : step.body_en}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {faqItems.length > 0 && (
              <>
                <h2>{t('svc.faq')}</h2>
                <Accordion items={faqItems} defaultOpen={0} />
              </>
            )}
          </div>

          <aside className="aside-panel">
            <h3>{t('svc.related')}</h3>
            <div className="aside-links">
              {related.map((item) => (
                <Link to={`/services/${item.slug}`} key={item.slug}>
                  <span>{lang === 'fa' ? item.title_fa : item.title_en}</span>
                  <Icon name="chevronEnd" size={13} className="rtl-flip" />
                </Link>
              ))}
            </div>
            <hr className="rule" />
            <p className="small muted" style={{ lineHeight: 1.8 }}>
              {t('svc.demoNote')}
            </p>
            <Link className="btn btn--ink btn--sm" to="/contact">
              {t('svc.cta')}
            </Link>
          </aside>
        </div>
      </div>

      <section id="demo" className="section section--ivory2">
        <div className="shell">
          <div style={{ display: 'grid', gap: 20, maxWidth: 880, marginInline: 'auto' }}>
            <div className="flex-between">
              <h2 className="h2">{t('svc.demo')}</h2>
              <span className="tag tag--demo">
                <Icon name="alert" size={13} />
                {lang === 'fa' ? 'شبیه‌سازی' : 'simulated'}
              </span>
            </div>
            {demo()}
          </div>
        </div>
      </section>
    </>
  );
}
