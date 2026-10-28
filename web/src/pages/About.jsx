import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal, StaggerText } from '../lib/motion.jsx';
import { Icon } from '../components/Icons.jsx';

const PILLARS = [
  {
    icon: 'layers',
    fa: ['ساختار یکسان برای همه خودروها', 'هر آگهی همان مجموعه فیلدها را دارد؛ تفاوت‌ها از جنس داده‌اند، نه از جنس متن تبلیغی.'],
    en: ['One structure for every car', 'Every listing carries the same fields; differences come from data, not from marketing copy.'],
  },
  {
    icon: 'scale',
    fa: ['مقایسه به‌جای فهرست بی‌پایان', 'حداکثر سه خودرو در یک جدول، با مشخصات ثبت‌شده — نه با حدس.'],
    en: ['Comparison instead of endless lists', 'Up to three cars in one table, using stored attributes — not guesswork.'],
  },
  {
    icon: 'shield',
    fa: ['صداقت درباره وضعیت نمونه', 'هر عدد ساختگی، طرح مفهومی و فرم شبیه‌سازی‌شده، همان‌جا برچسب خورده است.'],
    en: ['Honesty about demo status', 'Every fictional figure, concept graphic and simulated form is labelled where it appears.'],
  },
];

const NOT_CLAIMS = [
  ['fa', 'این سایت خودرو نمی‌فروشد و موجودی واقعی ندارد.'],
  ['fa', 'قیمت‌ها به بازار واقعی متصل نیستند و به‌روز نمی‌شوند.'],
  ['fa', 'هیچ نهاد مالی، بیمه یا کارشناسی، این پلتفرم را تأیید نکرده است.'],
  ['fa', 'هیچ شماره تماس واقعی در این نسخه منتشر نشده است.'],
];
const NOT_CLAIMS_EN = [
  'This site does not sell cars and holds no real inventory.',
  'Prices are not connected to any real market and are not updated.',
  'No financial, insurance or inspection body endorses this platform.',
  'No real contact number is published in this build.',
];

export default function About() {
  const { t, lang } = useI18n();

  return (
    <>
      <section className="page-hero" data-nav-tone="light">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('nav.about')}</span>
          </nav>
          <h1>{lang === 'fa' ? 'درباره علی‌لند' : 'About AliLand'}</h1>
          <p>
            {lang === 'fa'
              ? 'علی‌لند یک نمونه کار است: تلاشی برای طراحی تجربه‌ای که در آن خرید خودرو با اطلاعات شروع شود، نه با فشار. این صفحه توضیح می‌دهد این نسخه چه کاری می‌کند، چه کاری نمی‌کند و چرا.'
              : 'AliLand is a portfolio concept: an attempt to design an experience where buying a car starts with information rather than pressure. This page explains what this build does, what it does not do, and why.'}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <span className="kicker">{t('about.philosophy')}</span>
            <StaggerText
              as="h2"
              className="display-2"
              text={
                lang === 'fa'
                  ? 'سه قاعده که همه بخش‌ها را شکل داده'
                  : 'Three rules that shaped every section'
              }
            />
          </div>

          <div className="grid-3">
            {PILLARS.map((pillar, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <div className="card" style={{ height: '100%', display: 'grid', gap: 10 }}>
                  <span
                    className="partner-card__icon"
                    style={{ background: 'var(--cobalt-wash)', color: 'var(--cobalt-deep)' }}
                  >
                    <Icon name={pillar.icon} size={17} />
                  </span>
                  <h3 className="h3">{lang === 'fa' ? pillar.fa[0] : pillar.en[0]}</h3>
                  <p className="small body-soft">{lang === 'fa' ? pillar.fa[1] : pillar.en[1]}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink" data-nav-tone="dark">
        <div className="shell">
          <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,70px)' }}>
            <div>
              <span className="kicker">{t('about.demoTitle')}</span>
              <h2 className="display-2 mt-2">
                {lang === 'fa' ? 'شفاف درباره محدودیت‌ها' : 'Open about the limits'}
              </h2>
              <p className="lead mt-2" style={{ color: 'rgba(243,242,238,0.7)' }}>
                {lang === 'fa'
                  ? 'یک نمونه کار خوب، بیش از آنکه درباره قابلیت‌ها صحبت کند، درباره آنچه نیست صادق است. این فهرست عمداً کوتاه و مشخص نوشته شده.'
                  : 'A good portfolio is honest about what it is not, more than it talks about features. This list is deliberately short and specific.'}
              </p>
            </div>

            <div className="stack">
              {NOT_CLAIMS.map((item, index) => (
                <Reveal key={index} delay={index * 0.05}>
                  <div
                    className="row"
                    style={{
                      gap: 12,
                      alignItems: 'flex-start',
                      paddingBlock: 14,
                      borderBlockEnd: '1px solid var(--hairline-dark)',
                    }}
                  >
                    <Icon name="minus" size={16} style={{ opacity: 0.5, marginBlockStart: 4 }} />
                    <span style={{ color: 'rgba(243,242,238,0.82)', lineHeight: 1.85 }}>
                      {lang === 'fa' ? item[1] : NOT_CLAIMS_EN[index]}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="two-col-text">
            <div>
              <h2 className="h2">{lang === 'fa' ? 'این نسخه چه چیزی هست' : 'What this build is'}</h2>
              <div className="prose mt-2">
                <p>
                  {lang === 'fa'
                    ? 'یک تجربه کامل و قابل کاوش: صحنه سینمایی ورود به نمایشگاه، فهرست خودرو با فیلترهای واقعی، مقایسه، خدمات، فرم‌های چندمرحله‌ای، مجله و یک پنل مدیریت با دسترسی محافظت‌شده که محتوا را در پایگاه داده ذخیره می‌کند.'
                    : 'A complete, explorable experience: a cinematic showroom entrance, a filterable catalogue, comparison, services, multi-step forms, a journal, and a protected admin panel that persists content to the database.'}
                </p>
                <p>
                  {lang === 'fa'
                    ? 'همه داده‌ها سینتتیک‌اند و در یک پایگاه داده واقعی ذخیره می‌شوند؛ بنابراین رفتار فیلترها، مقایسه و ویرایش محتوا همان رفتار یک محصول واقعی است.'
                    : 'All data is synthetic and stored in a real database, so filtering, comparison and content editing behave as they would in a real product.'}
                </p>
              </div>
            </div>

            <div>
              <h2 className="h2">{lang === 'fa' ? 'چطور شروع کنیم' : 'Where to start'}</h2>
              <div className="stack mt-2">
                {[
                  ['/vehicles', lang === 'fa' ? 'فهرست خودروها و فیلترها' : 'Catalogue and filters'],
                  ['/compare', lang === 'fa' ? 'مقایسه دو یا سه خودرو' : 'Compare two or three cars'],
                  ['/services/finder', lang === 'fa' ? 'خودرویاب سه‌سؤالی' : 'The three-question finder'],
                  ['/sell', lang === 'fa' ? 'فرم فروش خودرو' : 'The sell form'],
                  ['/admin', lang === 'fa' ? 'پنل مدیریت (ورود محافظت‌شده)' : 'Admin panel (protected)'],
                ].map(([to, label]) => (
                  <Link className="link-arrow" to={to} key={to} style={{ justifySelf: 'start' }}>
                    {label}
                    <Icon name="arrowEnd" size={14} className="rtl-flip" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
