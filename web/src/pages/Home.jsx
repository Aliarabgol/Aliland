import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Reveal } from '../lib/motion.jsx';
import Hero from '../sections/Hero.jsx';
import IntroBand from '../sections/IntroBand.jsx';
import Discovery from '../sections/Discovery.jsx';
import Featured from '../sections/Featured.jsx';
import ServicesShowcase from '../sections/ServicesShowcase.jsx';
import Journeys from '../sections/Journeys.jsx';
import InspectionStory from '../sections/InspectionStory.jsx';
import Finance from '../sections/Finance.jsx';
import { PartnerTeaser, FounderTeaser } from '../sections/PartnerFounder.jsx';
import { JournalTeaser, FaqTeaser, FinalCta } from '../sections/JournalFaq.jsx';
import FinderQuiz from '../components/FinderQuiz.jsx';
import { SectionHead } from '../components/ui.jsx';

export default function Home() {
  const { t, lang } = useI18n();
  const { section, visible } = useSite();
  const [featured, setFeatured] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [articles, setArticles] = useState([]);
  const [services, setServices] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get('/vehicles?featured=true&perPage=6&sort=featured'),
      api.get('/vehicles?perPage=48&sort=price_asc'),
      api.get('/articles'),
      api.get('/services'),
      api.get('/vehicles/facets'),
    ])
      .then(([featuredRes, allRes, articleRes, serviceRes, facetRes]) => {
        if (cancelled) return;
        setFeatured(featuredRes.items || []);
        setAllVehicles(allRes.items || []);
        setArticles(articleRes.items || []);
        setServices(serviceRes.items || []);
        const grouped = {};
        for (const row of facetRes.counts || []) {
          grouped[row.category] = (grouped[row.category] || 0) + row.n;
        }
        setCounts(grouped);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const finder = section('finder');

  return (
    <>
      <Hero />
      <IntroBand
        vehiclesCount={Object.values(counts).reduce((sum, value) => sum + value, 0)}
        servicesCount={services.length}
      />
      <Discovery counts={counts} />
      <Featured vehicles={featured} loading={loading} />

      {visible('finder') && (
        <section className="section">
          <div className="shell">
            <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,64px)' }}>
              <div>
                <SectionHead
                  kicker={t('home.finder.kicker')}
                  title={(lang === 'fa' ? finder?.title_fa : finder?.title_en) || t('home.finder.kicker')}
                  body={(lang === 'fa' ? finder?.subtitle_fa : finder?.subtitle_en) || ''}
                />
                <Reveal className="stack" delay={0.1}>
                  {[
                    lang === 'fa' ? 'سه سؤال، بدون ثبت‌نام' : 'Three questions, no sign-up',
                    lang === 'fa' ? 'رتبه‌بندی بر پایه داده همین فهرست' : 'Ranked from this catalogue only',
                    lang === 'fa' ? 'نتیجه قابل توضیح، نه جعبه سیاه' : 'An explainable result, not a black box',
                  ].map((line) => (
                    <div className="row" key={line} style={{ gap: 10 }}>
                      <span className="tag tag--cobalt">✓</span>
                      <span className="small">{line}</span>
                    </div>
                  ))}
                </Reveal>
              </div>
              <FinderQuiz compact />
            </div>
          </div>
        </section>
      )}

      <ServicesShowcase services={services} />
      <Journeys services={services} />
      <InspectionStory />
      <Finance vehicles={allVehicles} />
      <PartnerTeaser />
      <FounderTeaser />
      <JournalTeaser articles={articles} />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
