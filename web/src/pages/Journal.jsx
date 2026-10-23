import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { dateLabel } from '../lib/format.js';
import { ErrorState } from '../components/States.jsx';

export function Journal() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/articles')
      .then((r) => setItems(r.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page">
      <header className="page-head">
        <div>
          <h1>راهنمای خرید</h1>
          <p className="muted">مقاله‌های کوتاه دربارهٔ بازدید، کارشناسی و مقایسهٔ خودرو.</p>
        </div>
      </header>
      {error ? (
        <ErrorState message={error} />
      ) : loading ? (
        <div className="skeleton skeleton-block" />
      ) : (
        <div className="article-grid">
          {items.map((a) => (
            <Link key={a.slug} to={`/journal/${a.slug}`} className="article-card">
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
              <span className="muted small">{dateLabel(a.published_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/articles/${slug}`)
      .then((a) => {
        setArticle(a);
        document.title = `${a.title} | راهنمای خرید`;
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <div className="container page"><ErrorState message={error} /></div>;
  if (!article) return <div className="container page"><div className="skeleton skeleton-block" /></div>;

  return (
    <article className="container page narrow">
      <nav className="breadcrumb" aria-label="مسیر">
        <Link to="/journal">راهنمای خرید</Link>
        <span aria-hidden="true">/</span>
        <span>{article.title}</span>
      </nav>
      <h1>{article.title}</h1>
      <p className="muted small">{dateLabel(article.published_at)}</p>
      <div className="prose">
        {article.body_md.split(/\n{2,}/).map((block, i) => (
          <p key={i}>{block}</p>
        ))}
      </div>
    </article>
  );
}
