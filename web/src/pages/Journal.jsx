import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Reveal } from '../lib/motion.jsx';
import ArticleCover from '../components/ArticleCover.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Journal() {
  const { t, bi, num } = useI18n();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/articles')
      .then((data) => setArticles(data.items || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => [...new Set(articles.map((article) => article.category))],
    [articles],
  );
  const filtered = category ? articles.filter((article) => article.category === category) : articles;

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('journal.title')}</span>
          </nav>
          <h1>{t('journal.title')}</h1>
          <p>{t('journal.desc')}</p>
        </div>
      </section>

      <div className="shell" style={{ paddingBlock: 'clamp(24px,4vw,44px) clamp(50px,8vw,90px)' }}>
        <div className="category-pills">
          <button type="button" className="chip" aria-pressed={!category} onClick={() => setCategory('')}>
            {t('journal.all')}
          </button>
          {categories.map((item) => (
            <button
              type="button"
              className="chip"
              key={item}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton" key={index} style={{ height: 300 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="doc" size={30} />
            <h3>{t('cat.empty')}</h3>
          </div>
        ) : (
          <div className="grid-3">
            {filtered.map((article, index) => (
              <Reveal key={article.slug} delay={(index % 3) * 0.06}>
                <Link className="article-card" to={`/journal/${article.slug}`}>
                  <ArticleCover tone={article.cover_tone} label={bi(article, 'title')} />
                  <div className="article-card__body">
                    <div className="article-card__meta">
                      <span className="tag tag--cobalt">{article.category}</span>
                      <span>{t('journal.readTime', { n: num(article.read_minutes) })}</span>
                    </div>
                    <h3>{bi(article, 'title')}</h3>
                    <p>{bi(article, 'excerpt')}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
