import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Reveal, StaggerText } from '../lib/motion.jsx';
import { Icon } from '../components/Icons.jsx';

const BRANDS = [
  'پژو', 'ایران‌خودرو', 'سایپا', 'تویوتا', 'هیوندای', 'کیا',
  'نیسان', 'بی‌ام‌و', 'مرسدس بنز', 'لکسوس', 'فونیکس', 'کی‌ام‌سی',
];

const BRANDS_EN = [
  'Peugeot', 'IKCO', 'Saipa', 'Toyota', 'Hyundai', 'Kia',
  'Nissan', 'BMW', 'Mercedes-Benz', 'Lexus', 'Fownix', 'KMC',
];

export default function IntroBand({ vehiclesCount, servicesCount }) {
  const { t, lang, num } = useI18n();
  const { section, visible } = useSite();
  if (!visible('intro')) return null;
  const data = section('intro');
  const title = (lang === 'fa' ? data?.title_fa : data?.title_en) || t('brand.tagline');
  const body = (lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || '';

  // Counts come from the live demo catalogue, never typed by hand.
  const stats = [
    { value: num(vehiclesCount ?? 0), label: lang === 'fa' ? 'آگهی نمونه در فهرست' : 'sample listings' },
    { value: num(3), label: lang === 'fa' ? 'دسته‌بندی خودرو' : 'vehicle categories' },
    { value: num(servicesCount ?? 0), label: lang === 'fa' ? 'صفحه خدمات' : 'service pages' },
    { value: num(2), label: lang === 'fa' ? 'زبان، یک تجربه' : 'languages, one experience' },
  ];

  return (
    <section className="intro-band" data-nav-tone="dark">
      <div className="shell">
        <div className="intro-band__grid">
          <div>
            <Reveal as="span" className="kicker">
              {t('home.intro.kicker')}
            </Reveal>
            <StaggerText as="h2" text={title} className="mt-2" />
            {body ? (
              <Reveal className="mt-3" delay={0.12}>
                <p className="lead" style={{ color: 'rgba(243,242,238,0.74)' }}>
                  {body}
                </p>
              </Reveal>
            ) : null}
            <Reveal className="mt-4" delay={0.2}>
              <Link className="btn btn--light" to="/about">
                {t('nav.about')}
                <Icon name="arrowEnd" size={16} className="rtl-flip" />
              </Link>
            </Reveal>
          </div>

          <div>
            <div className="intro-band__stats">
              {stats.map((stat, index) => (
                <Reveal className="stat-line" key={stat.value + index} delay={index * 0.06}>
                  <span className="stat-line__value">{stat.value}</span>
                  <span className="stat-line__label">{stat.label}</span>
                </Reveal>
              ))}
            </div>
            <Reveal className="intro-band__note" delay={0.2}>
              <Icon name="info" size={14} style={{ display: 'inline', verticalAlign: '-2px', marginInlineEnd: 6 }} />
              {t('footer.note')}
            </Reveal>
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...BRANDS, ...BRANDS].map((brand, index) => (
            <span className="marquee__item" key={`${brand}-${index}`}>
              {lang === 'fa' ? brand : BRANDS_EN[index % BRANDS_EN.length]}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
