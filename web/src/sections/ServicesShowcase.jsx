import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Reveal, Parallax } from '../lib/motion.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import { SectionHead } from '../components/ui.jsx';
import { Icon, SERVICE_ICON } from '../components/Icons.jsx';

export default function ServicesShowcase({ services }) {
  const { t, lang, bi } = useI18n();
  const { section, visible } = useSite();
  if (!visible('services')) return null;
  const data = section('services');
  const list = services.length ? services : [];

  return (
    <section className="section" id="services">
      <div className="shell">
        <SectionHead
          kicker={t('home.services.kicker')}
          title={(lang === 'fa' ? data?.title_fa : data?.title_en) || t('services')}
          body={(lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || ''}
          split
          action={
            <Link className="link-arrow" to="/services">
              {t('svc.overview')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          }
        />

        <div className="services-shell">
          <aside className="services-aside">
            <Parallax speed={26}>
              <div className="services-aside__visual">
                <VehicleArt tone="#1d2432" accent="#BE8459" angle="cabin" />
              </div>
            </Parallax>
            <div className="card" style={{ background: 'var(--ink)', color: 'var(--on-dark)', borderColor: 'var(--ink-line)' }}>
              <span className="label" style={{ color: 'var(--bronze-soft)' }}>
                {t('svc.demoNote')}
              </span>
              <p className="small mt-1" style={{ color: 'rgba(243,242,238,0.66)', lineHeight: 1.9 }}>
                {t('footer.note')}
              </p>
            </div>
          </aside>

          <div className="services-list">
            {list.map((service, index) => (
              <Reveal key={service.slug} delay={Math.min(index * 0.04, 0.2)}>
                <Link className="service-row" to={`/services/${service.slug}`}>
                  <span className="service-row__n">{service.number || String(index + 1).padStart(2, '0')}</span>
                  <div className="service-row__main">
                    <h3>
                      <Icon
                        name={SERVICE_ICON[service.slug] || 'sparkles'}
                        size={16}
                        style={{ marginInlineEnd: 8, opacity: 0.5, verticalAlign: '-2px' }}
                      />
                      {bi(service, 'title')}
                    </h3>
                    <p>{bi(service, 'kicker')}</p>
                  </div>
                  <span className="service-row__go" aria-hidden="true">
                    <Icon name="arrowEnd" size={15} className="rtl-flip" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
