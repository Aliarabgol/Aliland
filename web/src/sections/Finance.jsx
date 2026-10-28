import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal, StaggerText } from '../lib/motion.jsx';
import { Icon } from '../components/Icons.jsx';

// Illustrative annual spread used only so the structure of an instalment is
// visible. This is NOT an interest rate, an offer, or credit approval.
const ILLUSTRATIVE_ANNUAL = 0.08;

export default function Finance({ vehicles = [] }) {
  const { t, lang, num, money } = useI18n();
  const sample = vehicles.find((vehicle) => vehicle.price_band === 'mid') || vehicles[0];
  const [price, setPrice] = useState(sample?.price_demo || 1_450_000_000);
  const [downPct, setDownPct] = useState(30);
  const [term, setTerm] = useState(36);
  const [mine, setMine] = useState(vehicles[0]?.slug || '');
  const [target, setTarget] = useState(vehicles[3]?.slug || vehicles[0]?.slug || '');

  const calc = useMemo(() => {
    const down = Math.round((price * downPct) / 100);
    const principal = price - down;
    const total = Math.round(principal * (1 + (ILLUSTRATIVE_ANNUAL * term) / 12));
    const monthly = Math.round(total / term);
    return { down, monthly, total, extra: total - price };
  }, [price, downPct, term]);

  const mineVehicle = vehicles.find((vehicle) => vehicle.slug === mine);
  const targetVehicle = vehicles.find((vehicle) => vehicle.slug === target);
  const gap =
    mineVehicle && targetVehicle ? Number(targetVehicle.price_demo) - Number(mineVehicle.price_demo) : 0;

  return (
    <section className="section section--ink" data-nav-tone="dark" id="finance">
      <div className="shell">
        <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(24px,4vw,64px)' }}>
          <div>
            <span className="kicker">{t('home.finance.kicker')}</span>
            <StaggerText
              as="h2"
              className="display-2 mt-2"
              text={lang === 'fa' ? 'تفاوت دو عدد' : 'The difference between two numbers'}
            />
            <p className="lead mt-2" style={{ color: 'rgba(243,242,238,0.7)' }}>
              {lang === 'fa'
                ? 'در معاوضه، عدد نهایی مهم نیست؛ فاصله بین ارزش خودروی فعلی شما و خودروی بعدی مهم است. در اقساط هم، قسط ماهانه تنهایی تصمیم‌ساز نیست — مجموع پرداختی است که وزن دارد.'
                : 'In a trade-in, the headline price is not the point; the gap between your current car and the next one is. With instalments too, the monthly figure alone does not decide anything — the total does.'}
            </p>
            <div className="row mt-3">
              <Link className="btn btn--onDark" to="/services/trade-in">
                {lang === 'fa' ? 'صفحه معاوضه' : 'Trade-in page'}
                <Icon name="arrowEnd" size={15} className="rtl-flip" />
              </Link>
              <Link className="btn btn--onDark" to="/services/installment">
                {t('installment.title')}
              </Link>
            </div>
          </div>

          <div className="stack" style={{ gap: 14 }}>
            <Reveal className="calc-card">
              <div className="flex-between">
                <h3 style={{ fontSize: '1.05rem' }}>{t('trade.title')}</h3>
                <span className="tag tag--bronze">{lang === 'fa' ? 'نمایشی' : 'demo'}</span>
              </div>
              <div className="form-grid form-grid--2" style={{ gap: 12 }}>
                <div className="field">
                  <label htmlFor="trade-mine">{t('trade.yourCar')}</label>
                  <select
                    id="trade-mine"
                    className="select"
                    value={mine}
                    onChange={(event) => setMine(event.target.value)}
                  >
                    {vehicles.map((vehicle) => (
                      <option value={vehicle.slug} key={vehicle.slug}>
                        {lang === 'fa'
                          ? `${vehicle.make_fa} ${vehicle.model_fa}`
                          : `${vehicle.make_en} ${vehicle.model_en}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="trade-target">{t('trade.targetCar')}</label>
                  <select
                    id="trade-target"
                    className="select"
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                  >
                    {vehicles.map((vehicle) => (
                      <option value={vehicle.slug} key={vehicle.slug}>
                        {lang === 'fa'
                          ? `${vehicle.make_fa} ${vehicle.model_fa}`
                          : `${vehicle.make_en} ${vehicle.model_en}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="calc-out">
                <div className="calc-out__cell">
                  <span>{t('trade.yourCar')}</span>
                  <strong>{money(mineVehicle?.price_demo)}</strong>
                </div>
                <div className="calc-out__cell">
                  <span>{t('trade.targetCar')}</span>
                  <strong>{money(targetVehicle?.price_demo)}</strong>
                </div>
                <div className="calc-out__cell">
                  <span>{t('trade.gap')}</span>
                  <strong style={{ color: gap > 0 ? 'var(--bronze-soft)' : '#8fd0a8' }}>
                    {gap > 0 ? `+ ${money(gap)}` : money(Math.abs(gap))}
                  </strong>
                </div>
              </div>
            </Reveal>

            <Reveal className="calc-card" delay={0.08}>
              <div className="flex-between">
                <h3 style={{ fontSize: '1.05rem' }}>{t('installment.title')}</h3>
                <span className="tag tag--bronze">{lang === 'fa' ? 'ساختار محاسبه' : 'structure only'}</span>
              </div>

              <div className="range-wrap">
                <div className="calc-range-label">
                  <span>{t('v.price')}</span>
                  <span className="num">{money(price)}</span>
                </div>
                <input
                  type="range"
                  min={500000000}
                  max={8000000000}
                  step={50000000}
                  value={price}
                  onChange={(event) => setPrice(Number(event.target.value))}
                  aria-label={t('v.price')}
                />
              </div>

              <div className="form-grid form-grid--2" style={{ gap: 12 }}>
                <div className="range-wrap">
                  <div className="calc-range-label">
                    <span>{t('installment.down')}</span>
                    <span className="num">{num(downPct)}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={70}
                    step={5}
                    value={downPct}
                    onChange={(event) => setDownPct(Number(event.target.value))}
                    aria-label={t('installment.down')}
                  />
                </div>
                <div className="field">
                  <label htmlFor="term">{t('installment.term')}</label>
                  <select
                    id="term"
                    className="select"
                    value={term}
                    onChange={(event) => setTerm(Number(event.target.value))}
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--on-dark)', borderColor: 'var(--hairline-dark)' }}
                  >
                    {[12, 18, 24, 36, 48, 60].map((value) => (
                      <option value={value} key={value} style={{ color: '#121722' }}>
                        {num(value)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="calc-out">
                <div className="calc-out__cell">
                  <span>{t('installment.down')}</span>
                  <strong>{money(calc.down)}</strong>
                </div>
                <div className="calc-out__cell">
                  <span>{t('installment.monthly')}</span>
                  <strong>{money(calc.monthly)}</strong>
                </div>
                <div className="calc-out__cell">
                  <span>{t('installment.total')}</span>
                  <strong>{money(calc.total)}</strong>
                </div>
              </div>
              <p className="small" style={{ color: 'rgba(243,242,238,0.45)', lineHeight: 1.8 }}>
                {t('installment.note')}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
