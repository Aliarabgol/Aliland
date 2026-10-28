import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal, StaggerText, Parallax } from '../lib/motion.jsx';
import { Icon } from '../components/Icons.jsx';

const PILLARS = [
  {
    fa: ['اطلاعات پیش از تبلیغ', 'هر خودرو با مشخصات یکسان توصیف می‌شود؛ نه با صفت‌های فروش.'],
    en: ['Information before promotion', 'Every car is described with the same attributes — not with sales adjectives.'],
  },
  {
    fa: ['مقایسه، نه انتخاب اجباری', 'هدف این نیست که سریع‌تر بخرید؛ این است که بتوانید انتخاب کنید.'],
    en: ['Comparison, not a forced choice', 'The aim is not to make you buy faster; it is to let you choose.'],
  },
  {
    fa: ['صداقت درباره آنچه نیست', 'هر بخش که نمونه یا شبیه‌سازی است، همان‌طور گفته می‌شود.'],
    en: ['Honesty about what it is not', 'Anything that is a sample or a simulation says so plainly.'],
  },
];

export default function Founder() {
  const { t, lang } = useI18n();

  return (
    <>
      <section className="service-hero" data-nav-tone="dark">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')} style={{ color: 'rgba(243,242,238,0.6)' }}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <Link to="/about">{t('nav.about')}</Link>
            <span className="sep">/</span>
            <span>{t('founder.title')}</span>
          </nav>

          <div className="service-hero__grid mt-3" style={{ alignItems: 'center' }}>
            <div>
              <span className="kicker">{t('founder.role')}</span>
              <StaggerText as="h1" text={t('founder.title')} className="mt-2" />
              <p className="lead mt-2" style={{ color: 'rgba(243,242,238,0.72)' }}>
                {lang === 'fa'
                  ? 'علی‌لند از یک ایده ساده شروع شد: در بازار خودرو، کمبود گزینه آزاردهنده نیست؛ کمبود اطلاعات درست است.'
                  : 'AliLand started from a simple idea: in the car market, missing options is not the problem — missing accurate information is.'}
              </p>
              <div className="row mt-3">
                <Link className="btn btn--primary" to="/partnership">
                  {t('nav.partnership')}
                  <Icon name="arrowEnd" size={15} className="rtl-flip" />
                </Link>
                <Link className="btn btn--onDark" to="/journal">
                  {t('nav.journal')}
                </Link>
              </div>
            </div>

            <Parallax speed={20}>
              <div className="portrait-frame" style={{ aspectRatio: '4/5' }}>
                <svg viewBox="0 0 400 500" style={{ width: '100%', height: '100%' }} aria-hidden="true">
                  <defs>
                    <linearGradient id="fp" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#33405a" />
                      <stop offset="55%" stopColor="#1a2130" />
                      <stop offset="100%" stopColor="#0a0d13" />
                    </linearGradient>
                    <radialGradient id="fg" cx="50%" cy="35%" r="55%">
                      <stop offset="0%" stopColor="#be8459" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#be8459" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="400" height="500" fill="url(#fp)" />
                  <rect width="400" height="500" fill="url(#fg)" />
                  <circle cx="200" cy="205" r="74" fill="#0f141d" opacity="0.9" />
                  <path d="M104 500c0-68 43-110 96-110s96 42 96 110Z" fill="#111823" />
                  <g stroke="#ffffff" strokeOpacity="0.07">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <line key={index} x1={index * 60} y1="0" x2={index * 60 - 90} y2="500" />
                    ))}
                  </g>
                  <rect x="0" y="0" width="400" height="500" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="24" />
                  <text x="200" y="96" textAnchor="middle" fill="#be8459" fontSize="12" letterSpacing="7" fontFamily="Inter, sans-serif">
                    ALILAND
                  </text>
                  <text x="200" y="452" textAnchor="middle" fill="#ffffff" fillOpacity="0.28" fontSize="11" letterSpacing="3" fontFamily="Inter, sans-serif">
                    PORTRAIT PLACEHOLDER
                  </text>
                </svg>
                <span className="portrait-frame__label">{t('founder.placeholder')}</span>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,70px)' }}>
            <div>
              <span className="kicker">{t('home.founder.kicker')}</span>
              <StaggerText
                as="h2"
                className="display-2 mt-2"
                text={
                  lang === 'fa'
                    ? 'یک نمایشگاه می‌تواند آرام باشد'
                    : 'A showroom can be calm'
                }
              />
            </div>
            <div className="prose">
              <p>
                {lang === 'fa'
                  ? 'بیشتر تجربه‌های خرید خودرو در ایران با فشار شروع می‌شوند: آگهی‌هایی که همه چیز را «فول» توصیف می‌کنند، قیمت‌هایی که مبنا ندارند، و تصمیمی که در نهایت با حس گرفته می‌شود. علی‌لند با این فرض ساخته شد که بخش بزرگی از این فشار، از نبود ساختار می‌آید نه از نبود خودرو.'
                  : 'Most car-buying experiences start with pressure: listings that describe everything as fully loaded, prices without a basis, and a decision that ends up being made on feeling. AliLand was built on the assumption that much of that pressure comes from missing structure rather than missing cars.'}
              </p>
              <p>
                {lang === 'fa'
                  ? 'ایده این است که یک صفحه بتواند سه کار را همزمان انجام دهد: اطلاعات را یکدست نشان دهد، مقایسه را ممکن کند، و بگوید چه چیزی را نمی‌داند. اگر یک عدد ساختگی است، همان‌جا نوشته می‌شود. اگر یک تصویر طرح مفهومی است، برچسب می‌خورد.'
                  : 'The idea is that one page can do three things at once: present information consistently, make comparison possible, and admit what it does not know. If a number is fictional, it says so. If an image is concept artwork, it is labelled.'}
              </p>
              <p>
                {lang === 'fa'
                  ? 'این نسخه، اولین قدم است: یک نمونه کار برای نشان دادن اینکه تجربه دیجیتال خودرو می‌تواند آرام، دقیق و قابل اعتماد باشد.'
                  : 'This build is the first step: a portfolio concept showing that a digital car experience can be calm, precise and trustworthy.'}
              </p>
            </div>
          </div>

          <div className="grid-3 mt-4">
            {PILLARS.map((pillar, index) => (
              <Reveal key={index} delay={index * 0.06}>
                <div className="card" style={{ height: '100%' }}>
                  <span className="label num">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="h3" style={{ marginBlock: '10px 8px' }}>
                    {lang === 'fa' ? pillar.fa[0] : pillar.en[0]}
                  </h3>
                  <p className="small body-soft">{lang === 'fa' ? pillar.fa[1] : pillar.en[1]}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-4">
            <div className="admin-note" style={{ padding: '18px 20px' }}>
              <Icon name="alert" size={16} />
              <span>{t('founder.factNote')}</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
