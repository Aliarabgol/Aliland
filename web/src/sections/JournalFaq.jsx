import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Reveal, StaggerText } from '../lib/motion.jsx';
import { Accordion } from '../components/ui.jsx';
import ArticleCover from '../components/ArticleCover.jsx';
import { Icon } from '../components/Icons.jsx';

export function JournalTeaser({ articles }) {
  const { t, lang, bi, num } = useI18n();
  const { section, visible } = useSite();
  if (!visible('journal') || !articles.length) return null;
  const data = section('journal');
  const [lead, ...rest] = articles;

  return (
    <section className="section">
      <div className="shell">
        <div className="section-head section-head--split">
          <div className="stack" style={{ gap: 12 }}>
            <span className="kicker">{t('home.journal.kicker')}</span>
            <h2 className="display-2">
              {(lang === 'fa' ? data?.title_fa : data?.title_en) || t('journal.title')}
            </h2>
          </div>
          <div className="stack" style={{ gap: 14 }}>
            <p>{(lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || t('journal.desc')}</p>
            <Link className="link-arrow" to="/journal">
              {t('act.viewAll')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          </div>
        </div>

        <div className="journal-grid">
          <Reveal>
            <Link className="article-card" to={`/journal/${lead.slug}`}>
              <ArticleCover tone={lead.cover_tone} label={bi(lead, 'title')} />
              <div className="article-card__body">
                <div className="article-card__meta">
                  <span className="tag tag--cobalt">{lead.category}</span>
                  <span>{t('journal.readTime', { n: num(lead.read_minutes) })}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem' }}>{bi(lead, 'title')}</h3>
                <p>{bi(lead, 'excerpt')}</p>
              </div>
            </Link>
          </Reveal>

          <div className="journal-side">
            {rest.slice(0, 3).map((article, index) => (
              <Reveal key={article.slug} delay={index * 0.06}>
                <Link className="article-card article-card--mini" to={`/journal/${article.slug}`}>
                  <ArticleCover tone={article.cover_tone} label={bi(article, 'title')} />
                  <div className="article-card__body">
                    <div className="article-card__meta">
                      <span>{article.category}</span>
                      <span>·</span>
                      <span>{t('journal.readTime', { n: num(article.read_minutes) })}</span>
                    </div>
                    <h3>{bi(article, 'title')}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqTeaser() {
  const { t, lang } = useI18n();
  const { faqs, section, visible } = useSite();
  if (!visible('faq')) return null;
  const data = section('faq');
  const items = faqs.slice(0, 5).map((faq) => ({
    question: lang === 'fa' ? faq.question_fa : faq.question_en,
    answer: lang === 'fa' ? faq.answer_fa : faq.answer_en,
  }));

  return (
    <section className="section section--ivory2">
      <div className="shell">
        <div className="grid-2" style={{ alignItems: 'start', gap: 'clamp(24px,5vw,70px)' }}>
          <div>
            <span className="kicker">{t('home.faq.kicker')}</span>
            <h2 className="display-2 mt-2">
              {(lang === 'fa' ? data?.title_fa : data?.title_en) || t('faq.title')}
            </h2>
            <p className="lead mt-2">
              {(lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || t('faq.desc')}
            </p>
            <Link className="link-arrow mt-3" to="/faq">
              {t('act.viewAll')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          </div>
          <Accordion items={items} defaultOpen={0} />
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { t, lang } = useI18n();
  const { section, visible } = useSite();
  if (!visible('final_cta')) return null;
  const data = section('final_cta');

  return (
    <section className="section">
      <div className="shell">
        <Reveal>
          <div className="cta-final" data-nav-tone="dark">
            <span className="kicker" style={{ color: 'var(--bronze-soft)' }}>
              {t('brand.tagline')}
            </span>
            <StaggerText
              as="h2"
              className="mt-2"
              text={(lang === 'fa' ? data?.title_fa : data?.title_en) || ''}
            />
            <p className="lead mt-2" style={{ color: 'rgba(243,242,238,0.72)' }}>
              {(lang === 'fa' ? data?.subtitle_fa : data?.subtitle_en) || ''}
            </p>
            <div className="row mt-4">
              <Link className="btn btn--primary btn--lg" to={data?.cta_href || '/vehicles'}>
                {(lang === 'fa' ? data?.cta_label_fa : data?.cta_label_en) || t('hero.cta')}
                <Icon name="arrowEnd" size={16} className="rtl-flip" />
              </Link>
              <Link className="btn btn--onDark btn--lg" to="/services">
                {t('svc.overview')}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
