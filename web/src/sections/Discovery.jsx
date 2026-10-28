import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Reveal } from '../lib/motion.jsx';
import VehicleArt from '../components/VehicleArt.jsx';
import { SectionHead } from '../components/ui.jsx';
import { CATEGORY_ICON, Icon } from '../components/Icons.jsx';

const CATEGORY_ART = {
  domestic: { tone: '#2b313d', accent: '#73808E' },
  imported: { tone: '#1b2130', accent: '#415CF0' },
  assembled: { tone: '#241d17', accent: '#BE8459' },
};

export default function Discovery({ counts }) {
  const { t, lang } = useI18n();
  const { section, visible } = useSite();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [budget, setBudget] = useState('');

  const data = section('discovery');
  const title = (lang === 'fa' ? data?.title_fa : data?.title_en) || t('home.discovery.kicker');
  const body_ = (lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || '';

  const countFor = (key) => counts?.[key] ?? '—';

  const submit = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (body) params.set('body', body);
    if (budget) params.set('band', budget);
    navigate(`/vehicles?${params.toString()}`);
  };

  const budgets = useMemo(
    () => [
      { value: 'economy', label: t('band.economy') },
      { value: 'mid', label: t('band.mid') },
      { value: 'premium', label: t('band.premium') },
      { value: 'luxury', label: t('band.luxury') },
    ],
    [t],
  );

  if (!visible('discovery')) return null;

  return (
    <section className="section" id="discovery">
      <div className="shell">
        <SectionHead
          kicker={t('home.discovery.kicker')}
          title={title}
          body={body_}
          split
          action={
            <Link className="link-arrow" to="/vehicles">
              {t('act.viewAll')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          }
        />

        <form className="quickbar" onSubmit={submit} role="search" aria-label={t('cat.search')}>
          <div className="field">
            <label htmlFor="disc-cat">{t('cat.all')}</label>
            <select
              id="disc-cat"
              className="select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">{t('cat.all')}</option>
              <option value="domestic">{t('cat.domestic')}</option>
              <option value="imported">{t('cat.imported')}</option>
              <option value="assembled">{t('cat.assembled')}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="disc-body">{t('v.bodyStyle')}</label>
            <select
              id="disc-body"
              className="select"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            >
              <option value="">{t('cat.any')}</option>
              {['sedan', 'hatchback', 'suv', 'crossover'].map((item) => (
                <option value={item} key={item}>
                  {t(`body.${item}`)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="disc-budget">{t('cat.priceRange')}</label>
            <select
              id="disc-budget"
              className="select"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            >
              <option value="">{t('cat.any')}</option>
              {budgets.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="disc-go">&nbsp;</label>
            <button className="btn btn--primary" type="submit" id="disc-go">
              <Icon name="search" size={16} />
              {t('nav.search')}
            </button>
          </div>
        </form>

        <div className="discovery-grid">
          {['domestic', 'imported', 'assembled'].map((key, index) => (
            <Reveal key={key} delay={index * 0.08}>
              <Link className="discovery-tile" to={`/vehicles/${key}`}>
                <div className="discovery-tile__art">
                  <span className="discovery-tile__count num">{countFor(key)}</span>
                  <VehicleArt tone={CATEGORY_ART[key].tone} accent={CATEGORY_ART[key].accent} angle="profile" />
                </div>
                <div className="discovery-tile__body">
                  <h3>
                    {t(`cat.${key}`)}
                    <Icon name={CATEGORY_ICON[key]} size={18} style={{ opacity: 0.6 }} />
                  </h3>
                  <p>{t(`cat.${key}.desc`)}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
