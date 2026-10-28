import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal, StaggerText } from '../lib/motion.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import { Icon } from '../components/Icons.jsx';

const POINTS = [
  {
    fa: ['بدنه و رنگ', 'ضخامت رنگ روی هر پنل، فاصله درزها و نشانه‌های تعویض. اینجا معلوم می‌شود کدام پنل اصلاح شده است.'],
    en: ['Body and paint', 'Paint thickness per panel, panel gaps and signs of replacement. This is where a repaired panel shows itself.'],
  },
  {
    fa: ['زیربندی', 'کمک‌فنر، بوش و نشتی‌ها؛ همان بخشی که بعد از خرید بیشترین هزینه را می‌سازد.'],
    en: ['Underbody', 'Shock absorbers, bushings and leaks — the parts that generate the biggest post-purchase bill.'],
  },
  {
    fa: ['کابین و تجهیزات', 'کارکرد واقعی تجهیزات: از کولر و شیشه‌بالابر تا نمایشگر و دوربین.'],
    en: ['Cabin and equipment', 'Whether the equipment actually works — climate, windows, screen, camera.'],
  },
  {
    fa: ['مدارک و سابقه', 'تطبیق شماره شاسی، سال ساخت و سابقه بیمه؛ چیزی که از روی عکس هرگز دیده نمی‌شود.'],
    en: ['Documents and history', 'VIN, build year and insurance history — what a photograph never shows.'],
  },
];

export default function InspectionStory() {
  const { t, lang } = useI18n();

  return (
    <section className="section section--ink" data-nav-tone="dark" id="inspection">
      <div className="shell">
        <div className="inspection-shell">
          <div className="inspection-sticky">
            <span className="kicker">{t('home.inspection.kicker')}</span>
            <StaggerText
              as="h2"
              className="display-2"
              text={
                lang === 'fa'
                  ? 'آنچه از روی عکس دیده نمی‌شود'
                  : 'What a photo cannot show'
              }
            />
            <p className="lead" style={{ color: 'rgba(243,242,238,0.7)' }}>
              {lang === 'fa'
                ? 'یک خودرو می‌تواند در عکس بی‌نقص باشد و در بازدید، سه مورد اصلاح رنگ داشته باشد. کارشناسی برای همین فاصله ساخته شده است: نه برای تأیید، برای روشن‌کردن.'
                : 'A car can look flawless in photos and have three repainted panels in person. Inspection exists for that gap — not to approve, but to make things clear.'}
            </p>
            <div className="mt-2">
              <VehicleArt tone="#1a2030" accent="#415CF0" angle="profile" />
            </div>
            <Link className="btn btn--onDark" to="/services/inspection">
              {t('svc.process')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          </div>

          <div>
            {POINTS.map((point, index) => (
              <Reveal className="checkpoint" key={index} delay={index * 0.05}>
                <span className="checkpoint__dot">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{lang === 'fa' ? point.fa[0] : point.en[0]}</h3>
                  <p>{lang === 'fa' ? point.fa[1] : point.en[1]}</p>
                </div>
              </Reveal>
            ))}
            <Reveal className="mt-3" delay={0.1}>
              <div className="row" style={{ gap: 10 }}>
                <span className="tag tag--bronze">{t('svc.demoNote')}</span>
                <span className="small" style={{ color: 'rgba(243,242,238,0.5)' }}>
                  {t('inspect.total')}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
