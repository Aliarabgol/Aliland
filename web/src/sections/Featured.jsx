import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Reveal } from '../lib/motion.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import { SectionHead } from '../components/ui.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Featured({ vehicles, loading }) {
  const { t, lang } = useI18n();
  const { section, visible } = useSite();
  if (!visible('featured')) return null;
  const data = section('featured');

  return (
    <section className="section section--ivory2">
      <div className="shell">
        <SectionHead
          kicker={t('home.featured.kicker')}
          title={(lang === 'fa' ? data?.title_fa : data?.title_en) || t('home.featured.kicker')}
          body={(lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || ''}
          split
          action={
            <Link className="link-arrow" to="/vehicles">
              {t('act.viewAll')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          }
        />

        <div className="vehicle-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div className="skeleton" key={index} style={{ height: 340 }} />
              ))
            : vehicles.map((vehicle, index) => (
                <Reveal key={vehicle.slug} delay={(index % 3) * 0.07}>
                  <VehicleCard vehicle={vehicle} />
                </Reveal>
              ))}
        </div>

        <Reveal className="mt-4 flex-between" delay={0.1}>
          <p className="demo-note">
            <Icon name="info" size={14} />
            <span>{t('v.demoNote')}</span>
          </p>
          <Link className="btn btn--ink" to="/compare">
            {t('cmp.title')}
            <Icon name="compare" size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
