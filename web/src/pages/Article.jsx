import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import ArticleCover from '../components/ArticleCover.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Article() {
  const { slug } = useParams();
  const { t, bi, num, lang } = useI18n();
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setMissing(false);
    api
      .get(`/articles/${slug}`)
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setMissing(true));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (missing) {
    return (
      <section className="page-hero">
        <div className="shell">
          <h1>{t('nf.title')}</h1>
          <Link className="btn btn--ink mt-2" to="/journal">
            {t('nav.journal')}
          </Link>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <div className="shell" style={{ paddingBlock: 'calc(var(--header-h) + 40px)' }}>
        <div className="skeleton" style={{ height: 420 }} />
      </div>
    );
  }

  const { article, related } = data;
  const body = bi(article, 'body') || '';
  const blocks = body.split('\n\n').filter(Boolean);
  const date = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.published_at));

  return (
    <article className="shell">
      <div className="article-shell">
        <nav className="breadcrumbs" aria-label={t('nav.menu')}>
          <Link to="/">{t('nav.home')}</Link>
          <span className="sep">/</span>
          <Link to="/journal">{t('nav.journal')}</Link>
          <span className="sep">/</span>
          <span>{article.category}</span>
        </nav>

        <div className="row mt-2" style={{ gap: 10 }}>
          <span className="tag tag--cobalt">{article.category}</span>
          <span className="small muted">{t('journal.readTime', { n: num(article.read_minutes) })}</span>
          <span className="small muted">·</span>
          <span className="small muted">{date}</span>
        </div>

        <h1>{bi(article, 'title')}</h1>
        <p className="lead">{bi(article, 'excerpt')}</p>

        <div className="article-cover">
          <ArticleCover tone={article.cover_tone} label={bi(article, 'title')} />
        </div>

        <div className="prose">
          {blocks.map((block, index) =>
            block.startsWith('## ') ? (
              <h2 key={index}>{block.replace('## ', '')}</h2>
            ) : (
              <p key={index}>{block}</p>
            ),
          )}
        </div>

        <p className="small muted mt-4" style={{ borderBlockStart: '1px solid var(--hairline)', paddingBlockStart: 16 }}>
          {lang === 'fa'
            ? 'این متن بخشی از محتوای نمونه مجله است و به عنوان خبر، قیمت روز یا توصیه تخصصی ارائه نمی‌شود.'
            : 'This text is sample journal content and is not presented as news, live pricing or specialist advice.'}
        </p>

        {related?.length > 0 && (
          <>
            <h2 className="h3 mt-4">{t('journal.related')}</h2>
            <div className="stack mt-2">
              {related.map((item) => (
                <Link className="aside-links" to={`/journal/${item.slug}`} key={item.slug} style={{ display: 'block' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      paddingBlock: 12,
                      borderBlockEnd: '1px solid var(--hairline)',
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{lang === 'fa' ? item.title_fa : item.title_en}</span>
                    <span className="small muted">
                      {t('journal.readTime', { n: num(item.read_minutes) })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <Link className="btn btn--ghost mt-4" to="/journal">
          <Icon name="arrowStart" size={15} className="rtl-flip" />
          {t('nav.journal')}
        </Link>
      </div>
    </article>
  );
}
