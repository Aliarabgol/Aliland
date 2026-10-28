import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal } from '../lib/motion.jsx';
import { SectionHead } from '../components/ui.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Journeys({ services }) {
  const { t, lang } = useI18n();
  const buy = services.find((service) => service.slug === 'buy');
  const sell = services.find((service) => service.slug === 'sell');
  const steps = (service) => (service?.steps || []).slice(0, 4);

  const block = (service, key, tone) => (
    <div className={`journey journey--${tone}`}>
      <span className={tone === 'sell' ? 'kicker' : 'kicker'} style={tone === 'sell' ? { color: 'var(--bronze-soft)' } : undefined}>
        {service ? (lang === 'fa' ? service.number : '') : ''}
        {t(`nav.${key}`)}
      </span>
      <h3>{service ? (lang === 'fa' ? service.title_fa : service.title_en) : t(`nav.${key}`)}</h3>
      <p className="small" style={tone === 'sell' ? { color: 'rgba(243,242,238,0.68)' } : undefined}>
        {service ? (lang === 'fa' ? service.intro_fa : service.intro_en) : ''}
      </p>
      <ol>
        {steps(service).map((step) => (
          <li key={step.title_fa}>
            <span style={tone === 'sell' ? { color: 'rgba(243,242,238,0.78)' } : undefined}>
              {lang === 'fa' ? step.title_fa : step.title_en}
            </span>
          </li>
        ))}
      </ol>
      <div className="journey__foot">
        <Link
          className={tone === 'sell' ? 'btn btn--light' : 'btn btn--ink'}
          to={`/services/${key}`}
        >
          {t('act.details')}
          <Icon name="arrowEnd" size={15} className="rtl-flip" />
        </Link>
      </div>
    </div>
  );

  return (
    <section className="section section--ivory2">
      <div className="shell">
        <SectionHead
          kicker={t('home.journey.kicker')}
          title={lang === 'fa' ? 'دو مسیر، یک استاندارد' : 'Two paths, one standard'}
          body={
            lang === 'fa'
              ? 'خرید و فروش دو روی یک تصمیم‌اند. در هر دو، اطلاعات دقیق مهم‌تر از تبلیغ است — و هر دو مسیر با یک پرسش شروع می‌شوند: وضعیت واقعی چیست؟'
              : 'Buying and selling are two sides of one decision. In both, accurate information beats promotion — and both start with one question: what is the real condition?'
          }
          split
        />
        <div className="journey-grid">
          <Reveal>{block(buy, 'buy', 'buy')}</Reveal>
          <Reveal delay={0.1}>{block(sell, 'sell', 'sell')}</Reveal>
        </div>
      </div>
    </section>
  );
}
